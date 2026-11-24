import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './components/TodoList';
import UpdateList from './components/UpdateList';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | done

  // GET: завантаження завдань при першому відображенні
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(API_URL, { params: { _limit: 5 } });
        setTasks(
          res.data.map((item) => ({
            id: item.id,
            title: item.title,
            done: item.completed,
            local: false, // завдання існує на сервері
          }))
        );
      } catch (err) {
        setError('Не вдалося завантажити завдання: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // POST: додавання нового завдання
  const addTask = async (title) => {
    setError('');
    try {
      await axios.post(API_URL, { title, completed: false, userId: 1 });
      // jsonplaceholder завжди повертає id=201 і нічого не зберігає,
      // тому для унікального key використовуємо власний id
      setTasks((prev) => [
        ...prev,
        { id: Date.now(), title, done: false, local: true },
      ]);
    } catch (err) {
      setError('Не вдалося додати завдання: ' + err.message);
    }
  };

  // PUT: оновлення завдання (спільна логіка для редагування і чекбокса)
  const updateTask = async (id, changes) => {
    setError('');
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = { ...task, ...changes };
    try {
      if (!task.local) {
        await axios.put(`${API_URL}/${id}`, {
          id,
          title: updated.title,
          completed: updated.done,
          userId: 1,
        });
      }
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError('Не вдалося оновити завдання: ' + err.message);
    }
  };

  const editTask = (id, newTitle) => updateTask(id, { title: newTitle });
  const toggleTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task) updateTask(id, { done: !task.done });
  };

  // DELETE: видалення завдання
  const removeTask = async (id) => {
    setError('');
    const task = tasks.find((t) => t.id === id);
    try {
      if (task && !task.local) {
        await axios.delete(`${API_URL}/${id}`);
      }
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('Не вдалося видалити завдання: ' + err.message);
    }
  };

  const visibleTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="container">
      <h2>Tasks list</h2>
      <UpdateList onAddTask={addTask} />

      <p className="counter">
        Виконано: {doneCount} з {tasks.length}
      </p>

      <div className="filters">
        {['all', 'active', 'done'].map((f) => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Усі' : f === 'active' ? 'Активні' : 'Виконані'}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <TodoList
          tasks={visibleTasks}
          onDelete={removeTask}
          onEdit={editTask}
          onToggle={toggleTask}
        />
      )}
    </div>
  );
}

export default App;