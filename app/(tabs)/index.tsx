// app/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";

interface Task {
  id: string;
  text: string;
  category?: string;
  completed: boolean;
}

type Filter = "all" | "completed" | "pending" | string;

const TASKS_KEY = "@tasks_storage";
const CATEGORIES_KEY = "@categories_storage";

export default function Index(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const { width } = useWindowDimensions();
  const isWeb = width > 600; // screen wider than 600px = web

  // Load tasks & categories from AsyncStorage
  useEffect(() => {
    const load = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem(TASKS_KEY);
        const savedCats = await AsyncStorage.getItem(CATEGORIES_KEY);
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedCats) setCategories(JSON.parse(savedCats));
      } catch (e) {
        console.log("Failed to load storage:", e);
      }
    };
    load();
  }, []);

  // Save tasks & categories on change
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
        await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
      } catch (e) {
        console.log("Failed to save storage:", e);
      }
    };
    save();
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
      const activeCategories = Array.from(new Set(updated.map((t) => t.category || "")))
        .filter((c) => c);
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
    <SafeAreaView style={[styles.container, isWeb ? styles.webContainer : styles.mobileContainer]}>
      <StatusBar barStyle="dark-content" />

      {/* Top card: title + input */}
      <View style={styles.card}>
        <Text style={styles.title}>Your Task Manager</Text>
        <TaskInput onAddTask={addTask} categories={categories} />
      </View>

      {/* Bottom card: filters + task list */}
      <View style={[styles.card, styles.bottomCard]}>
        <View style={styles.filters}>
          {/* ✅ Custom Completed button */}
          <Pressable
            onPress={() => setFilter("completed")}
            style={({ hovered, pressed }) => [
              styles.filterButton,
              filter === "completed" && styles.filterButtonActive,
              hovered && styles.filterButtonHover,
              pressed && styles.filterButtonPressed,
            ]}
          >
            <Text style={styles.filterButtonText}>Completed</Text>
          </Pressable>

          {/* ✅ Custom Pending button */}
          <Pressable
            onPress={() => setFilter("pending")}
            style={({ hovered, pressed }) => [
              styles.filterButton,
              filter === "pending" && styles.filterButtonActive,
              hovered && styles.filterButtonHover,
              pressed && styles.filterButtonPressed,
            ]}
          >
            <Text style={styles.filterButtonText}>Pending</Text>
          </Pressable>

          {/* Category picker */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filter}
              style={styles.picker}
              onValueChange={(value) => setFilter(value)}
            >
              <Picker.Item label="All" value="all" />
              {categories.map((cat) => (
                <Picker.Item key={cat.toLowerCase()} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
        </View>

        <TaskList
          tasks={visibleTasks}
          onToggleComplete={toggleComplete}
          onDelete={deleteTask}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#e6f4ea" },

  // Web specific layout (centered card-like)
  webContainer: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },

  // Mobile layout (use full width)
  mobileContainer: {
    width: "100%",
  },

  card: {
    backgroundColor: "#c7dacaff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  bottomCard: {
    flex: 1,
    paddingBottom: 10,
  },
  title: {
    fontSize: 38,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#4f805f",
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    padding: 8,
    backgroundColor: "#daf2d8",
    borderRadius: 12,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#b6e1b2",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0fff4",
    marginLeft: 6,
  },
  picker: {
    width: 100,
    height: 50,
  },

  // ✅ New button styles
  filterButton: {
    paddingVertical: 15,
    paddingHorizontal: 17,
    borderRadius: 10,
    backgroundColor: "#559657ff",
    marginHorizontal: 0,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  filterButtonHover: {
    backgroundColor: "#46864a", // darker on hover
  },
  filterButtonPressed: {
    backgroundColor: "#356a39", // even darker when pressed
  },
  filterButtonActive: {
    backgroundColor: "#2e5c32", // stays darker when active/selected
  },
});
