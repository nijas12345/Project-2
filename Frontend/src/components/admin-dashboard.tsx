import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Timer,
  ProjectorIcon,
  Briefcase,
  CheckCircle,
  Grid,
  Loader,
} from "lucide-react";

import { toast } from "react-toastify";
import {
  adminLogoutService,
  getCompanyInfo,
  getTaskCounts,
} from "../services/adminApi/adminAuthService";
import { adminLogout } from "../redux/Slices/AdminAuth";
import { useDispatch } from "react-redux";

const AdminDashboard: React.FC = () => {
  const [pending, setPending] = useState<number>(0);
  const [inProgress, setInProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);
  const [companyName, setCompanyName] = useState<string>("");
  const [userCount, setUserCount] = useState<number>(0);
  const [projectCount, setProjectCount] = useState<number>(0);
  const [premium, setPremium] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCompanyInformations = async () => {
    try {
      const data = await getCompanyInfo();
      setCompanyName(data.companyName);
      setUserCount(data.userCount);
      setProjectCount(data.projectCount);
      setPremium(data.premium);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message == "Access denied. Refresh token not provided.") {
          await adminLogoutService();
          dispatch(adminLogout());
          navigate("/admin/login");
        }
        toast.error(error.message);
      } else {
        toast.error("Fetching company info failed.");
      }
    }
  };

  const fetchTaskDetails = async () => {
    try {
      const data = await getTaskCounts();
      setPending(data.pending);
      setInProgress(data.inProgress);
      setCompleted(data.completed);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        toast.error("Failed to fetch task counts.");
      }
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, []);

  useEffect(() => {
    fetchCompanyInformations();
  }, []);

  return (
    <div className="flex min-h-screen w-full  flex-col ml-4 lg:ml-0 ">
      {/* Main Content */}
      <div className="container px-4 py-6 lg:px-8 flex-1 overflow-y-auto">
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex space-x-4">
            <div className="px-4 py-2 text-lg font-semibold text-gray-700">
              {companyName}
            </div>
          </div>

          <div className="relative w-full md:w-64 flex justify-between items-center">
            <span className="text-gray-700"></span>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-800 transition"
              onClick={() => {
                navigate("/premium");
              }}
            >
              {premium}
            </button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {/* My Status Card */}
          <div className="border rounded-lg p-4 shadow-md bg-white">
            <div className="border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold">My Status</h2>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <ProjectorIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{projectCount}</div>
                    <div className="text-sm text-muted-foreground">
                      Total Projects
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{userCount}</div>
                    <div className="text-sm text-muted-foreground">
                      Total Team Members
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Timer className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold"></div>
                    <div className="text-sm text-muted-foreground">
                      Work Time
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  navigate("/admin/management");
                }}
                className="mt-4 px-4 py-2 text-blue-500 hover:underline transition"
              >
                View Team Members
              </button>
            </div>
          </div>

          {/* Task Statistics Card */}
          <div className="border rounded-lg p-4 shadow-md bg-white">
            <div className="border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold">Task Statistics</h2>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Grid className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{pending}</div>
                    <div className="text-sm text-muted-foreground">
                      Pending Tasks
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Loader className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{inProgress}</div>
                    <div className="text-sm text-muted-foreground">
                      In Progress
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{completed}</div>
                    <div className="text-sm text-muted-foreground">
                      Completed Tasks
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="mt-4 px-4 py-2 text-blue-500 hover:underline transition"
                onClick={() => navigate("/admin/chat")}
              >
                View Chats
              </button>
            </div>
          </div>
        </div>

        {/* Meetings Card */}
        <div className="border rounded-lg p-4 shadow-md bg-white mt-6">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-semibold">Meetings</h2>
            <button
              onClick={() => navigate("/admin/meetings")}
              className="text-blue-500 hover:underline transition"
            >
              View All Meetings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
