import { useState } from 'react';

function TodoItem({ task, onDelete, onEdit, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const handleSave = () => {
    const title = draft.trim();
    if (!title) return;
    onEdit(task.id, title);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(task.title);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="task-item">
        <input
          className="edit-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          autoFocus
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </li>
    );
  }

  return (
    <li className="task-item">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.title}" as done`}
      />
      <span className={task.done ? 'title done' : 'title'}>{task.title}</span>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </li>
  );
}

export default TodoItem;