// app/TaskItem.tsx
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

interface TaskItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({
  id,
  text,
  completed,
  onToggleComplete,
  onDelete,
}: TaskItemProps) {
  return (
    <View style={[styles.taskRow, completed && styles.completedTaskRow]}>
      <Pressable
        style={styles.textContainer}
        onPress={() => onToggleComplete(id)}
      >
        <Text style={[styles.taskText, completed && styles.completedTaskText]}>
          {text}
        </Text>
      </Pressable>
      <Pressable onPress={() => onDelete(id)}>
        <Text style={styles.deleteBtn}>🗑️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#d4e8d4",
    paddingVertical: Platform.OS === "web" ? 18 : 12, // bigger padding on web
    paddingHorizontal: Platform.OS === "web" ? 22 : 15,
    borderRadius: 14,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  completedTaskRow: {
    backgroundColor: "#9fc79f", // darker pastel green for completed tasks
  },
  textContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: Platform.OS === "web" ? 20 : 18, // slightly bigger on web
    color: "#3d5c3d",
  },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: "#2f4f2f",
  },
  deleteBtn: {
    fontSize: Platform.OS === "web" ? 20 : 18,
    marginLeft: 14,
  },
});
