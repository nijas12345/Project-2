// utils/taskSearchHandler.ts
import { deleteTaskComment, fetchTasksByProject, searchTasks } from "../services/adminApi/adminAuthService";
import { Task } from "../apiTypes/apiTypes";
import { showDeleteConfirmation } from "../utils/swalUtils";

export const handleSearch = async (
  event: React.ChangeEvent<HTMLInputElement>,
  selectedProject: string|null,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  setPendingTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setInProgressTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setDoneTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const value = event.target.value;
  setSearchTerm(value);

  try {
    let projectId = selectedProject || "active";
    const allTasks = await searchTasks(value, projectId);

    const pending = allTasks.filter((task: Task) => task.status === "pending");
    const inProgress = allTasks.filter((task: Task) => task.status === "inProgress");
    const done = allTasks.filter((task: Task) => task.status === "completed");

    setPendingTasks(pending);
    setInProgressTasks(inProgress);
    setDoneTasks(done);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Search failed:", error.message);
    }
  }
};


export const handleTaskDeleteComment = async (
  id: string | undefined,
  setTask: (task: any) => void // Replace `any` with `Task` if you have the type
) => {
  try {
    const isConfirmed = await showDeleteConfirmation();

    if (isConfirmed && id) {
      const data = await deleteTaskComment(id);
      setTask(data);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting comment:", error.message);
    } else {
      console.error("An unknown error occurred while deleting the comment.");
    }
  }
};




