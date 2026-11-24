import TodoItem from './TodoItem';

function TodoList({ tasks = [], onDelete, onEdit, onToggle }) {
  if (tasks.length === 0) {
    return <p className="empty">Завдань немає</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}

export default TodoList;