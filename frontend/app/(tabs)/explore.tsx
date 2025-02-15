import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Modal,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons"; // For icons

type TaskColumns = {
  todo: string[];
  inProgress: string[];
  done: string[];
};

type TaskDueDates = {
  [task: string]: string | null; // Store date as a string for web compatibility
};

export default function TaskManagementScreen() {
  const [taskColumns, setTaskColumns] = useState<TaskColumns>({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [newTask, setNewTask] = useState<Record<keyof TaskColumns, string>>({
    todo: "",
    inProgress: "",
    done: "",
  });
  const [taskDueDates, setTaskDueDates] = useState<TaskDueDates>({});
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null); // Track which task's menu is open
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [selectedTaskForDate, setSelectedTaskForDate] = useState<string | null>(
    null
  );
  const [selectedDateTime, setSelectedDateTime] = useState("");

  const handleAddTask = (column: keyof TaskColumns) => {
    const task = newTask[column].trim();
    if (task !== "") {
      setTaskColumns({
        ...taskColumns,
        [column]: [...taskColumns[column], task],
      });
      setNewTask({ ...newTask, [column]: "" });
      Keyboard.dismiss(); // Dismiss the keyboard after adding the task
    }
  };

  const handleMoveTask = (
    task: string,
    from: keyof TaskColumns,
    to: keyof TaskColumns
  ) => {
    setTaskColumns((prev) => {
      const newColumns = { ...prev };
      newColumns[from] = newColumns[from].filter((t) => t !== task);
      newColumns[to] = [task, ...newColumns[to]]; // Add to the top of the destination column
      return newColumns;
    });
    setVisibleMenu(null); // Close the menu after moving the task
  };

  const handleSetDueDate = (task: string) => {
    setSelectedTaskForDate(task);
    setDateTimePickerVisible(true);
    setVisibleMenu(null); // Close the menu after opening the date picker
  };

  const handleConfirmDateTime = () => {
    if (selectedTaskForDate) {
      setTaskDueDates((prev) => ({
        ...prev,
        [selectedTaskForDate]: selectedDateTime,
      }));
    }
    setDateTimePickerVisible(false);
  };

  const handleCancelDateTime = () => {
    setDateTimePickerVisible(false);
  };

  const handleDeleteTask = (task: string, column: keyof TaskColumns) => {
    setTaskColumns((prev) => ({
      ...prev,
      [column]: prev[column].filter((t) => t !== task),
    }));
    setVisibleMenu(null); // Close the menu after deleting the task
  };

  // Format the due date to exclude seconds
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Today
      </ThemedText>

      <View style={styles.columnsContainer}>
        {Object.entries(taskColumns).map(([column, tasks]) => (
          <View key={column} style={styles.column}>
            <ThemedText type="subtitle" style={styles.columnTitle}>
              {column === "inProgress"
                ? "In Progress"
                : column.charAt(0).toUpperCase() + column.slice(1)}
            </ThemedText>
            {tasks.map((task, index) => (
              <View key={index} style={styles.taskItem}>
                <Text style={styles.taskText}>{task}</Text>
                {taskDueDates[task] && (
                  <Text style={styles.dueDateText}>
                    Due: {formatDueDate(taskDueDates[task]!)}
                  </Text>
                )}
                <View>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() =>
                      setVisibleMenu(visibleMenu === task ? null : task)
                    }
                  >
                    <Ionicons name="chevron-down" size={20} color="white" />
                  </TouchableOpacity>

                  {visibleMenu === task && (
                    <View style={styles.dropdownMenu}>
                      {(column === "todo" || column === "inProgress") && (
                        <>
                          <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                              if (column === "todo") {
                                handleMoveTask(task, "todo", "inProgress");
                              } else if (column === "inProgress") {
                                handleMoveTask(task, "inProgress", "done");
                              }
                            }}
                          >
                            <Ionicons
                              name="checkmark"
                              size={20}
                              color="white"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleSetDueDate(task)}
                          >
                            <Ionicons name="time" size={20} color="white" />
                          </TouchableOpacity>
                        </>
                      )}
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() =>
                          handleDeleteTask(task, column as keyof TaskColumns)
                        }
                      >
                        <Ionicons name="trash" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}
            <TextInput
              style={styles.input}
              placeholder="Add a task"
              placeholderTextColor="#777"
              value={newTask[column as keyof TaskColumns]}
              onChangeText={(text) =>
                setNewTask({ ...newTask, [column]: text })
              }
              onSubmitEditing={() => handleAddTask(column as keyof TaskColumns)} // Submit on Enter
              blurOnSubmit={false} // Keep the keyboard open after submitting
            />
          </View>
        ))}
      </View>

      {/* Date and Time Picker Modal for Web */}
      <Modal
        transparent={true}
        visible={isDateTimePickerVisible}
        onRequestClose={handleCancelDateTime}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <input
              type="datetime-local"
              value={selectedDateTime}
              onChange={(e) => setSelectedDateTime(e.target.value)}
              style={styles.dateTimeInput}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmDateTime}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelDateTime}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  columnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  taskText: {
    color: "white",
    fontSize: 16,
    flex: 1,
  },
  dueDateText: {
    color: "#ff6347",
    fontSize: 12,
    marginLeft: 10,
  },
  dropdownButton: {
    padding: 5,
  },
  dropdownMenu: {
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "#333",
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
  },
  menuItem: {
    padding: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "white",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxWidth: 400,
    alignItems: "center", // Center the content horizontally
  },
  dateTimeInput: {
    width: "100%", // Match the width of the buttons
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#555",
    backgroundColor: "#222",
    color: "white",
  },
  confirmButton: {
    width: "100%", // Match the width of the input
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButton: {
    width: "100%", // Match the width of the input
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
});
