import React, { useEffect, useState } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";

interface Task {
  id: string;
  text: string;
  category?: string;
  completed: boolean;
}

type Filter = "all" | "completed" | "pending" | string;

const TASKS_KEY = "tasks_storage";
const CATEGORIES_KEY = "categories_storage";

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  // Load tasks & categories from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(TASKS_KEY);
    const savedCats = localStorage.getItem(CATEGORIES_KEY);
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedCats) setCategories(JSON.parse(savedCats));
  }, []);

  // Save tasks & categories
  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [tasks, categories]);

  const addTask = (text: string, category?: string) => {
    if (!text.trim()) return;
    const normalizedCategory = category?.trim() || "";

    if (normalizedCategory) {
      const lower = normalizedCategory.toLowerCase();
      setCategories((prev) =>
        prev.some((c) => c.toLowerCase() === lower) ? prev : [normalizedCategory, ...prev]
      );
    }

    const newTask: Task = {
      id: Date.now().toString(),
      text,
      category: normalizedCategory || undefined,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      const activeCategories = Array.from(new Set(updated.map((t) => t.category || ""))).filter(
        (c) => c
      );
      setCategories(activeCategories);
      return updated;
    });
  };

  // Filtering
  let visibleTasks = tasks;
  if (filter === "completed") visibleTasks = tasks.filter((t) => t.completed);
  else if (filter === "pending") visibleTasks = tasks.filter((t) => !t.completed);
  else if (filter !== "all")
    visibleTasks = tasks.filter((t) => t.category?.toLowerCase() === filter.toLowerCase());

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Task Manager</h1>
      <div style={styles.card}>
        <TaskInput onAddTask={addTask} categories={categories} />
      </div>

      <div style={styles.card}>
        <div style={styles.filters}>
          <button
            onClick={() => setFilter("completed")}
            style={{
              ...styles.filterButton,
              ...(filter === "completed" ? styles.filterButtonActive : {}),
            }}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("pending")}
            style={{
              ...styles.filterButton,
              ...(filter === "pending" ? styles.filterButtonActive : {}),
            }}
          >
            Pending
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All</option>
            {categories.map((cat) => (
              <option key={cat.toLowerCase()} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <TaskList tasks={visibleTasks} onToggleComplete={toggleComplete} onDelete={deleteTask} />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "sans-serif" },
  title: { textAlign: "center", fontSize: 36, color: "#4f805f", marginBottom: 20 },
  card: {
    backgroundColor: "#c7daca",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
  },
  filters: { display: "flex", alignItems: "center", gap: 10, marginBottom: 15 },
  filterButton: {
    padding: "10px 15px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "#559657",
    color: "#fff",
    cursor: "pointer",
  },
  filterButtonActive: { backgroundColor: "#2e5c32" },
  select: { padding: 10, borderRadius: 10, border: "1px solid #b6e1b2" },
};
