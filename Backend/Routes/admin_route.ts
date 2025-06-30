import { Router } from "express";

import AdminRepository from "../Repositories/adminRepository";
import AdminServices from "../Services/adminServices";
import AdminController from "../Controllers/adminController";
import Admin from "../Model/adminModal";
import { adminVerifyToken } from "../Config/jwt_config";
import CompanyRepository from "../Repositories/companyRepository";
import CompanyServices from "../Services/companyServices";
import CompanyController from "../Controllers/companyController";
import Company from "../Model/companyModal";
import ProjectController from "../Controllers/projectController";
import ProjectRepository from "../Repositories/projectRepository";
import ProjectServices from "../Services/projectServices";
import User from "../Model/userModal";
import Project from "../Model/projectModal";
import Message from "../Model/chatModal";
import Task from "../Model/taskModal";
import TaskRepository from "../Repositories/taskRepository";
import TaskServices from "../Services/taskServices";
import TaskController from "../Controllers/taskController";
import upload from "../Config/multer_config";
import ChatRepository from "../Repositories/chatRepository";
import ChatServices from "../Services/chatServices";
import ChatController from "../Controllers/chatController";
import Meeting from "../Model/meetingModal";
import Payment from "../Model/paymentModal";
import NotificationRepository from "../Repositories/notificationRepository";
import NotificationService from "../Services/notificationServices";
import NotificationController from "../Controllers/notificationController";
import Notification from "../Model/notificationModal";
import MeetingRepository from "../Repositories/meetingRepository";
import MeetingServices from "../Services/meetingServices";
import MeetingController from "../Controllers/meetingController";
import PaymentService from "../Services/paymentServices";
import PaymentRepository from "../Repositories/paymentRepository";
import PaymentController from "../Controllers/paymentController";
import UserRepository from "../Repositories/userRepository";

const adminRepository = new AdminRepository(Admin);
const userRepository = new UserRepository(User);
const companyRepository = new CompanyRepository(Company);
const projectRepository = new ProjectRepository(Project);
const paymentRepository = new PaymentRepository(Payment);
const taskRepository = new TaskRepository(Task);
const chatRepository = new ChatRepository(Message);
const notificationRepository = new NotificationRepository(Notification);
const meetingRepository = new MeetingRepository(Meeting);

const adminService = new AdminServices(adminRepository, userRepository);
const adminController = new AdminController(adminService);

const companyService = new CompanyServices(
  companyRepository,
  adminRepository,
  userRepository,
  projectRepository,
  paymentRepository
);
const companyController = new CompanyController(companyService);

const projectService = new ProjectServices(
  projectRepository,
  adminRepository,
  userRepository,
  paymentRepository,
  companyRepository,
  taskRepository,
  chatRepository
);
const projectController = new ProjectController(projectService);

const paymentService = new PaymentService(paymentRepository);
const paymentController = new PaymentController(paymentService);

const taskService = new TaskServices(taskRepository, userRepository);
const taskController = new TaskController(taskService);

const chatService = new ChatServices(chatRepository);
const chatController = new ChatController(chatService);

const notificationService = new NotificationService(
  notificationRepository,
  adminRepository,
  userRepository,
  taskRepository
);
const notificationController = new NotificationController(notificationService);

const meetingService = new MeetingServices(
  meetingRepository,
  adminRepository,
  userRepository,
  projectRepository
);
const meetingController = new MeetingController(meetingService);

const admin_router = Router();

admin_router.post("/register", adminController.register);
admin_router.post("/otp", adminController.otpVerification);
admin_router.get("/resend-otp", adminController.resendOTP);
admin_router.post("/login", adminController.login);
admin_router.post("/google/auth", adminController.verifyGoogleAuth);
admin_router.put("/reset-password", adminController.resetPassword);
admin_router.put("/validate-reset-token", adminController.validateToken);
admin_router.put("/change-password", adminController.confirmResetPassword);

admin_router.get("/logout", adminController.logout);
admin_router.post(
  "/upload-profile-image",
  adminVerifyToken,
  upload.single("profileImage"),
  adminController.adminProfilePicture
);
admin_router.post("/payment", adminVerifyToken, paymentController.payment);

admin_router.get(
  "/get-notifications",
  adminVerifyToken,
  notificationController.getAdminNotifications
);

admin_router.get(
  "/get-notifications-count",
  adminVerifyToken,
  notificationController.adminNotificationsCount
);

admin_router.post(
  "/update-user",
  adminVerifyToken,
  adminController.updateAdmin
);

admin_router.post(
  "/companyDetails",
  adminVerifyToken,
  companyController.companyDetails
);

admin_router.post(
  "/create-project",
  adminVerifyToken,
  projectController.createProject
);
admin_router.get(
  "/get-projects",
  adminVerifyToken,
  projectController.getAdminProjects
);
admin_router.put(
  "/update-project",
  adminVerifyToken,
  projectController.updateProject
);
admin_router.get(
  "/project-members",
  adminVerifyToken,
  projectController.projectMembers
);
admin_router.put(
  "/delete-project",
  adminVerifyToken,
  projectController.deleteProject
);
admin_router.post(
  "/create-task",
  adminVerifyToken,
  upload.single("file"),
  taskController.taskDetails
);
admin_router.put("/tasks", adminVerifyToken, taskController.adminTasks);
admin_router.patch(
  "/edit-task",
  adminVerifyToken,
  upload.single("file"),
  taskController.editTask
);
admin_router.patch("/delete-task", adminVerifyToken, taskController.deleteTask);
admin_router.get(
  "/count-tasks",
  adminVerifyToken,
  taskController.adminCountTasks
);
admin_router.post(
  "/add-comment",
  adminVerifyToken,
  taskController.addAdminComment
);
admin_router.patch(
  "/delete-comment",
  adminVerifyToken,
  taskController.deleteComment
);

admin_router.get(
  "/company-members",
  adminVerifyToken,
  companyController.companyMembers
);
admin_router.put(
  "/search-users",
  adminVerifyToken,
  companyController.searchMembers
);
admin_router.put("/user-block", adminVerifyToken, adminController.blockUser);
admin_router.put(
  "/user-unBlock",
  adminVerifyToken,
  adminController.unBlockUser
);
admin_router.get(
  "/company-data",
  adminVerifyToken,
  companyController.companyData
);
admin_router.put(
  "/invitation",
  adminVerifyToken,
  companyController.invitationUsers
);
admin_router.patch(
  "/inviteUser",
  adminVerifyToken,
  companyController.inviteUser
);
admin_router.patch(
  "/get-selected-projects",
  adminVerifyToken,
  projectController.getSelectedProject
);
admin_router.get(
  "/company-info",
  adminVerifyToken,
  companyController.companyInfo
);

admin_router.get(
  "/get-projects/chats",
  adminVerifyToken,
  projectController.AdminchatProjects
);
admin_router.get(
  "/messages/:projectId",
  adminVerifyToken,
  chatController.getAdminChats
);
admin_router.get(
  "/get-projects/meetings",
  adminVerifyToken,
  meetingController.getAdminMeetings
);
admin_router.get(
  "/project-members",
  adminVerifyToken,
  projectController.projectMembers
);
admin_router.post(
  "/schedule-meeting",
  adminVerifyToken,
  meetingController.scheduleMeeting
);
admin_router.put(
  "/fetchMeetings",
  adminVerifyToken,
  meetingController.AdminfetchMeetings
);
admin_router.patch(
  "/updateStatus",
  adminVerifyToken,
  meetingController.updateMeetingStatus
);
admin_router.get("/search", adminVerifyToken, taskController.getSearchResults);

export default admin_router;
