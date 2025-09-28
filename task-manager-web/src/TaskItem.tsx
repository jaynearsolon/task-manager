import React from "react";

interface TaskItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ id, text, completed, onToggleComplete, onDelete }: TaskItemProps) {
  return (
    <div
      style={{
        ...styles.taskRow,
        ...(completed ? styles.completedTaskRow : {}),
      }}
    >
      <span style={{ ...styles.taskText, ...(completed ? styles.completedTaskText : {}) }} onClick={() => onToggleComplete(id)}>
        {text}
      </span>
      <button style={styles.deleteBtn} onClick={() => onDelete(id)}>
        🗑️
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  taskRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#d4e8d4",
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
  },
  completedTaskRow: { backgroundColor: "#9fc79f" },
  taskText: { fontSize: 18, cursor: "pointer", color: "#3d5c3d" },
  completedTaskText: { textDecoration: "line-through", color: "#2f4f2f" },
  deleteBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 18,
  },
};
