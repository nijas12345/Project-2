import { Comments, Project } from "../../apiTypes/apiTypes";
import axiosInstance from "../../utils/axiosInstance";

export interface MeetingUpdatePayload {
  meetingId: string;
  status: string;
}

export const resetAdminPassword = async (email: string) => {
  const response = await axiosInstance.put("/admin/reset-password", { email });
  return response.data;
};

export const resendAdminResetPassword = async (email: string) => {
  const response = await axiosInstance.put("/admin/reset-password", { email });
  return response.data;
};

export const validateResetToken = async (token: string): Promise<boolean> => {
  const response = await axiosInstance.put("/admin/validate-reset-token", {
    token,
  });
  return response.status === 200;
};

export const changeAdminPassword = async (
  password: string,
  token: string | undefined
) => {
  const response = await axiosInstance.put("/admin/change-password", {
    password,
    token,
  });

  return response.data;
};

export const getAdminProjectsWithChats = async () => {
  const response = await axiosInstance.get("/admin/get-projects/chats");
  return response.data;
};

export const fetchAdminNotifications = async () => {
  const response = await axiosInstance.get("/admin/get-notifications");
  return response.data;
};

export const saveCompanyDetails = async (companyData: any) => {
  const response = await axiosInstance.post(
    "/admin/companyDetails",
    companyData
  );
  return response.data;
};

export const loginAdmin = async (email: string, password: string) => {
  const response = await axiosInstance.post("/admin/login", {
    email,
    password,
  });
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.get("/logout", {
    withCredentials: true,
  });
  return response.data;
};

export const googleAdminLogin = async (token: string) => {
  const response = await axiosInstance.post("/admin/google/auth", { token });
  return response.data;
};

export const getMeetingProjects = async () => {
  const response = await axiosInstance.get("/admin/get-projects/meetings");
  return response.data;
};

export const verifyAdminOtp = async (otp: string) => {
  const response = await axiosInstance.post("/admin/otp", { otp });
  return response.data;
};

export const resendAdminOtp = async () => {
  const response = await axiosInstance.get("/admin/resend-otp");
  return response.data;
};

export const registerAdmin = async (formData: Record<string, any>) => {
  console.log(formData);

  const response = await axiosInstance.post("/admin/register", formData);
  return response.data;
};

export const getCompanyInfo = async () => {
  const response = await axiosInstance.get("/admin/company-info");
  return response.data;
};

export const getTaskCounts = async () => {
  const response = await axiosInstance.get("/admin/count-tasks");
  return response.data;
};

export const adminLogoutService = async () => {
  const response = await axiosInstance.get("/admin/logout", {
    withCredentials: true,
  });
  return response.data;
};

export const updateMeetingStatus = async (data: MeetingUpdatePayload) => {
  const response = await axiosInstance.patch("/admin/updateStatus", data);
  return response.data;
};

export const fetchMeetingsByProject = async (projectId: string) => {
  const response = await axiosInstance.put("/admin/fetchMeetings", {
    projectId,
  });
  return response.data;
};

export const scheduleMeeting = async (
  projectId: string,
  meetingTime: string,
  roomId: string
) => {
  const response = await axiosInstance.post("/admin/schedule-meeting", {
    projectId,
    meetingTime,
    roomId,
  });
  return response.data;
};

export const fetchAdminProjects = async () => {
  const response = await axiosInstance.get("/admin/get-projects");
  return response.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await axiosInstance.put("/admin/delete-project", {
    projectId,
  });
  return response.data;
};

export const createProject = async (projectData: any) => {
  const response = await axiosInstance.post(
    "/admin/create-project",
    projectData
  );
  return response.data;
};

// Update Project
export const updateProject = async (projectData: any) => {
  const response = await axiosInstance.put(
    "/admin/update-project",
    projectData
  );
  return response.data;
};

export const uploadProfileImage = async (formData: FormData) => {
  const response = await axiosInstance.post(
    "/admin/upload-profile-image",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

export const fetchNotifications = async () => {
  const response = await axiosInstance.get("/admin/get-notifications-count");
  return response.data;
};

export const updateAdminDetails = async (adminDetails: {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  position: string;
  city: string;
  state: string;
}) => {
  const response = await axiosInstance.post("/admin/update-user", adminDetails);
  return response.data;
};

export const deleteTaskComment = async (id: string) => {
  const response = await axiosInstance.patch("/admin/delete-comment", { id });
  return response.data;
};

export const searchTasks = async (query: string, projectId: string) => {
  const response = await axiosInstance.get(`/admin/search`, {
    params: { query, projectId },
  });
  return response.data;
};

export const addOrEditComment = async (
  taskId: string,
  commentData: Comments
) => {
  const response = await axiosInstance.post("/admin/add-comment", {
    taskId,
    commentData,
  });
  return response.data;
};

export const fetchTasksByProject = async (projectId: string | null) => {
  const requestBody = projectId ? { projectId } : {};
  const response = await axiosInstance.put("/admin/tasks", requestBody);
  return response.data;
};

export const getProjects = async () => {
  const response = await axiosInstance.get("/admin/get-projects", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getProjectMembers = async (projectId: string) => {
  const response = await axiosInstance.get("/admin/project-members", {
    params: { projectId },
  });
  return response.data;
};

export const createTask = async (taskDetails: FormData | any) => {
  const response = await axiosInstance.post("/admin/create-task", taskDetails, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteTaskById = async (taskId: string) => {
  const response = await axiosInstance.patch("/admin/delete-task", { taskId });
  return response.data;
};

export const editTask = async (taskDetails: FormData | any) => {
  const response = await axiosInstance.patch("/admin/edit-task", taskDetails, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const fetchMessagesByProject = async (
  projectId: string,
  page: number,
  limit: number = 10
) => {
  const response = await axiosInstance.get(
    `/admin/messages/${projectId}?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const searchUsers = async (
  searchQuery: string,
  selectedProject: Project | null
) => {
  const response = await axiosInstance.put("/admin/search-users", {
    searchQuery,
    selectedProject,
  });
  return response.data;
};
