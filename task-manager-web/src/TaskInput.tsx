import React, { useState } from "react";

interface TaskInputProps {
  onAddTask: (text: string, category?: string) => void;
  categories: string[];
}

export default function TaskInput({ onAddTask, categories }: TaskInputProps) {
  const [taskText, setTaskText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newCategory, setNewCategory] = useState("");

  const handleAddTask = () => {
    if (!taskText.trim()) return;

    let finalCategory = selectedCategory;
    if (selectedCategory === "__add_new__" && newCategory.trim()) {
      finalCategory = newCategory.trim();
    }

    onAddTask(taskText, finalCategory || "");
    setTaskText("");
    setNewCategory("");
    setSelectedCategory(finalCategory || "");
  };

  return (
    <div style={styles.inputContainer}>
      <input
        style={styles.input}
        placeholder="Enter task"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={styles.select}
      >
        <option value="">No Category</option>
        {categories.map((cat) => (
          <option key={cat.toLowerCase()} value={cat}>
            {cat}
          </option>
        ))}
        <option value="__add_new__">➕ Add Category</option>
      </select>

      {selectedCategory === "__add_new__" && (
        <input
          style={styles.input}
          placeholder="Enter new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      )}

      <button style={styles.addButton} onClick={handleAddTask}>
        Add
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  inputContainer: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 15 },
  input: {
    padding: 15,
    borderRadius: 12,
    border: "1px solid #b6e1b2",
    fontSize: 16,
  },
  select: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid #a0ca9d",
    fontSize: 16,
  },
  addButton: {
    padding: 12,
    borderRadius: 12,
    border: "none",
    backgroundColor: "#4fa871",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
};
