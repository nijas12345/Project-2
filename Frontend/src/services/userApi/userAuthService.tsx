import axiosInstance from "../../utils/axiosInstance";
import { CompanyMember, Project } from "../../apiTypes/apiTypes";

export const getChatProjects = async () => {
  const response = await axiosInstance.get("/get-projects/chat");
  return response.data;
};

export const fetchClockStatistics = async () => {
  const response = await axiosInstance.get("/clock-statistics");
  return response.data;
};

export const requestPasswordReset = async (email: string) => {
  const response = await axiosInstance.put("/reset-password", { email });
  return response.data;
};

export const logoutUser = async () => {
  return await axiosInstance.get("/logout", { withCredentials: true });
};

export const userLogin = async (email: string, password: string) => {
  const response = await axiosInstance.post("/login", { email, password });
  return response.data;
};

export const submitReferralCode = async (referralCode: string) => {
  const response = await axiosInstance.post("/refferalCode", {
    refferalCode: referralCode,
  });
  return response.data;
};

export const resendResetPasswordLink = async (email: string) => {
  const response = await axiosInstance.put("/reset-password", { email });
  return response;
};

export const adminLogoutService = async () => {
  const response = await axiosInstance.get("/admin/logout", {
    withCredentials: true,
  });
  return response;
};

export const googleLogin = async (token: string) => {
  const response = await axiosInstance.post("/google/auth", { token });
  return response.data;
};

export const getNotifications = async () => {
  const response = await axiosInstance.get("/get-notifications");
  return response.data;
};

export const getMeetingProjects = async () => {
  const response = await axiosInstance.get("/get-projects/meetings");
  return response;
};

export const verifyOtp = async (otp: string) => {
  const response = await axiosInstance.post("/otp", { otp });
  return response.data;
};

export const resendOtp = async () => {
  const response = await axiosInstance.get("/resend-otp");
  return response.data;
};

export const createMonthlyPayment = async (subscription: string) => {
  const response = await axiosInstance.post("/admin/payment", { subscription });
  return response.data; // assuming this is the r-trect URL
};

export const createYearlyPayment = async (
  subscription: string,
  email: string
) => {
  const response = await axiosInstance.post("/admin/payment", {
    subscription,
    email,
  });
  return response.data; // assuming this is the redirect URL
};

export const validateResetToken = async (token: string) => {
  const response = await axiosInstance.put("/validate-reset-token", { token });
  return response.data;
};

export const resetPassword = async (
  password: string,
  token: string | undefined
) => {
  const response = await axiosInstance.put("/change-password", {
    password,
    token,
  });
  return response.data;
};

export const registerUser = async (
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  },
  referralCode?: string
) => {
  const url = referralCode
    ? `/register?refferalCode=${referralCode}`
    : "/register";

  const response = await axiosInstance.post(url, formData);
  return response.data;
};

export const fetchAdminProjects = async () => {
  const response = await axiosInstance.get("/admin/get-projects");
  return response.data;
};

export const fetchMeetingsByProject = async (projectId: string) => {
  const response = await axiosInstance.patch("/fetchMeetings", { projectId });
  return response.data;
};

export const scheduleMeeting = async (
  projectId: string,
  meetingTime: string,
  roomId: string
) => {
  const response = await axiosInstance.post("/schedule-meeting", {
    projectId,
    meetingTime,
    roomId,
  });
  return response.data;
};

export const getCompanyInfo = async () => {
  const response = await axiosInstance.get("/company-info");
  return response.data;
};

export const uploadProfileImage = (formData: FormData) => {
  const response = axiosInstance.post("/upload-profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const updateUserDetails = async (userDetails: {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  position: string;
  city: string;
  state: string;
}) => {
  const response = await axiosInstance.post("/update-user", userDetails);
  return response.data;
};

export const getNotificationsCount = async () => {
  const response = await axiosInstance.get("/get-notifications-count");
  return response.data;
};

export const reInviteUser = async (email: string) => {
  const response = await axiosInstance.patch("/admin/inviteUser", { email });
  return response.data;
};

export const getSelectedProjectUsers = async (project: Project | null) => {
  const response = await axiosInstance.patch("/admin/get-selected-projects", {
    project,
  });
  return response.data;
};

export const inviteMembers = async (members: CompanyMember[]) => {
  const response = await axiosInstance.put("/admin/invitation", { members });
  return response.data;
};

export const getCompanyData = async () => {
  const response = await axiosInstance.get("/admin/company-data");
  return response.data;
};

export const getCompanyMembers = async () => {
  const response = await axiosInstance.get("/admin/company-members");
  return response.data;
};

export const blockUserById = async (user_id: string) => {
  const response = await axiosInstance.put("/admin/user-block", { user_id });
  return response.data;
};

export const unblockUserById = async (user_id: string) => {
  const response = await axiosInstance.put("/admin/user-unblock", { user_id });
  return response.data;
};

export const getClockStatus = async () => {
  const response = await axiosInstance.get("/clock-status");
  return response.data;
};

export const clockIn = async (clockInTime: Date) => {
  const response = await axiosInstance.post("/clock-in", { clockInTime });
  return response.data;
};

export const clockOut = async (clockInTime: Date) => {
  const response = await axiosInstance.post("/clock-out", { clockInTime });
  return response.data;
};

export const startBreak = async () => {
  const response = await axiosInstance.get("/break-in");
  return response.data;
};

export const clockOutDuringBreak = async (clockInTime: Date) => {
  const response = await axiosInstance.post("/clock-out", { clockInTime });
  return response.data;
};

export const fetchCompanyInfo = async () => {
  const response = await axiosInstance.get("/company-info");
  return response.data;
};

export const endBreak = async () => {
  const response = await axiosInstance.get("/break-out");
  return response;
};

export const getProjectMessages = async (projectId: string, page: number) => {
  const response = await axiosInstance.get(
    `/messages/${projectId}?page=${page}&limit=10`
  );
  return response.data;
};

export const getTaskCounts = async () => {
  const response = await axiosInstance.get("/count-tasks");
  return response.data;
};

export const updateTaskStatus = async (
  taskId: string,
  projectId: string | null,
  status: string
) => {
  const response = await axiosInstance.patch("/update-task-status", {
    taskId,
    projectId,
    status,
  });
  return response.data; // assuming it's an array of all tasks
};

export const updateAcceptanceStatus = async (
  taskId: string,
  acceptanceStatus: "active" | "reAssigned" | "rejected"
) => {
  const response = await axiosInstance.put("/acceptance-status", {
    taskId,
    acceptanceStatus,
  });
  return response.data;
};

export const deleteTaskComment = async (id: string) => {
  const response = await axiosInstance.patch("/delete-comment", { id });
  return response.data; // updated task
};

export const addTaskComment = async (
  taskId: string,
  commentData: { user: string; text: string; createdAt: Date }
) => {
  const response = await axiosInstance.post("/add-comment", {
    taskId,
    commentData,
  });
  return response.data; // updated task
};

export const fetchTasksByProject = async (projectId: string | null) => {
  const requestBody = projectId ? { projectId } : {};
  const response = await axiosInstance.put("/tasks", requestBody);
  return response.data; // return all tasks
};

export const fetchUserProjects = async (): Promise<Project[]> => {
  const response = await axiosInstance.get("/get-projects", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
