// app/TaskList.tsx
import React from "react";
import { FlatList } from "react-native";
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
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 20 }}
      renderItem={({ item }) => (
        <TaskItem
          key={item.id}
          id={item.id}
          // show "category: task" if category exists
          text={item.category ? `${item.category}: ${item.text}` : item.text}
          completed={item.completed}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      )}
    />
  );
}
