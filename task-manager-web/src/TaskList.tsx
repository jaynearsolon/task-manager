import React from "react";
import TaskItem from "./TaskItem";

interface Task {
  id: string;
  text: string;
  category?: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onToggleComplete, onDelete }: TaskListProps) {
  return (
    <div style={styles.listContainer}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          text={task.category ? `${task.category}: ${task.text}` : task.text}
          completed={task.completed}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  listContainer: { display: "flex", flexDirection: "column", gap: 8, paddingBottom: 20 },
};
