// app/TaskInput.tsx
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Button, Platform, StyleSheet, TextInput, View } from "react-native";

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
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, Platform.OS === "web" && styles.webInput]}
        placeholder="Enter task"
        placeholderTextColor="#253d25ff"
        value={taskText}
        onChangeText={setTaskText}
      />

      <View style={[styles.pickerWrapper, Platform.OS === "web" && styles.webInput]}>
        <Picker
          selectedValue={selectedCategory}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="No Category" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat.toLowerCase()} label={cat} value={cat} />
          ))}
          <Picker.Item label="➕ Add Category" value="__add_new__" />
        </Picker>
      </View>

      {selectedCategory === "__add_new__" && (
        <TextInput
          style={[styles.input, Platform.OS === "web" && styles.webInput]}
          placeholder="Enter new category"
          placeholderTextColor="#6cae6c"
          value={newCategory}
          onChangeText={setNewCategory}
        />
      )}

      <View style={[styles.buttonWrapper, Platform.OS === "web" && styles.webInput]}>
        <Button title="Add" color="#4fa871" onPress={handleAddTask} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 15, alignItems: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#b6e1b2",
    borderRadius: 15,
    padding: 19,
    marginBottom: 10,
    backgroundColor: "#f0fff4",
    shadowColor: "#6cae6c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: "100%", // default mobile full width
  },
  webInput: {
    width: 600, // much wider for web
    maxWidth: "100%",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#a0ca9dff",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#f0fff4",
    width: "100%",
  },
  picker: {
    height: 55,
  },
  buttonWrapper: {
    borderRadius: 15,
    overflow: "hidden",
    width: "100%",
  },
});
