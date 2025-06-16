import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Timer,
  Briefcase,
  Search,
  CheckCircle,
  Grid,
  Loader,
} from "lucide-react";

import { toast } from "react-toastify";
import {
  clockIn,
  clockOut,
  clockOutDuringBreak,
  endBreak,
  fetchCompanyInfo,
  getClockStatus,
  getTaskCounts,
  startBreak,
} from "../services/userApi/userAuthService";

const Component: React.FC = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [workDuration, setWorkDuration] = useState(0); // in seconds
  const [breakDuration, setBreakDuration] = useState(0); // in seconds
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [pending, setPending] = useState<number>(0);
  const [inProgress, setInProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);
  const [companyName, setCompanyName] = useState<string>("");

  const navigate = useNavigate();
  // Format duration in h:m:s format
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours} h ${minutes} m ${remainingSeconds} s`;
  };

  const fetchTaskDetails = async () => {
    try {
      const data = await getTaskCounts();
      setPending(data.pending);
      setInProgress(data.inProgress);
      setCompleted(data.completed);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Fetching tasks failed.");
      }
    }
  };

  const reloadAtMidnight = () => {
    const now = new Date();
    const targetTime = new Date(now);
    targetTime.setHours(0, 0, 0, 0);
    if (targetTime.getTime() < now.getTime()) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const timeUntilTarget = targetTime.getTime() - now.getTime();

    setTimeout(() => {
      window.location.reload();
      reloadAtMidnight();
    }, timeUntilTarget);
  };

  const handleClockIn = async (): Promise<void> => {
    const currentTime = new Date();

    try {
      const data = await clockIn(currentTime);
      setIsClockedIn(true);

      if (typeof data.serviceResponse === "number") {
        setWorkDuration(data.serviceResponse / 1000); // seconds
      } else {
        const clockInTime = new Date(data.serviceResponse);
        setClockInTime(clockInTime);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error clocking in:", error.message);
      } else {
        console.error("Unexpected error during clock-in.");
      }
    }
  };
  //clock-out handler
  const handleClockOut = async () => {
    const currentTime = new Date();

    try {
      const data = await clockOut(currentTime);
      setIsClockedIn(false);
      setWorkDuration(data / 1000); // Assuming response is total work duration in ms
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error clocking out:", error.message);
      } else {
        console.error("Unexpected error during clock-out.");
      }
    }
  };

  const companyInfo = async () => {
    try {
      const data = await fetchCompanyInfo();
      setCompanyName(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching company info:", error.message);
      } else {
        console.error("Unexpected error fetching company info.");
      }
    }
  };

  // Start Break handler
  const handleStartBreak = async () => {
    const currentTime = new Date();
    try {
      const breakResponse = await startBreak();
      setIsOnBreak(true);

      const clockOutData = await clockOutDuringBreak(currentTime);
      if (isClockedIn) {
        setIsClockedIn(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error starting break:", error.message);
      } else {
        console.error("Unexpected error while starting break.");
      }
    }
  };

  // End Break handler
  const handleEndBreak = async () => {
    try {
      const response = await endBreak();
      if (response.status === 200) {
        setIsOnBreak(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error ending break:", error.message);
      } else {
        console.error("Unknown error occurred while ending break.");
      }
    }
  };

  // Fetch clock details from the backend
  const fetchClockDetails = async () => {
    try {
      const data = await getClockStatus();
      if (data) {
        const { date, workDuration, isClockedIn, breakDuration, isOnBreak } =
          data;
        const clockIn = new Date(date);
        setClockInTime(clockIn);
        setWorkDuration(Math.floor(workDuration / 1000));
        setIsClockedIn(isClockedIn);
        setIsOnBreak(isOnBreak);
        setBreakDuration(Math.floor(breakDuration / 1000));
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    fetchClockDetails();
  }, []);

  useEffect(() => {
    companyInfo();
    fetchTaskDetails();
  }, []);
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    // Start counting work time or break time if applicable
    if (isClockedIn && !isOnBreak) {
      interval = setInterval(() => {
        setWorkDuration((prevDuration) => prevDuration + 1); // Increment by 1 second
      }, 1000);
    } else if (isOnBreak) {
      interval = setInterval(() => {
        setBreakDuration((prevDuration) => prevDuration + 1); // Increment break duration by 1 second
      }, 1000);
    }

    // Cleanup interval on unmount or state change
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClockedIn, isOnBreak]);

  // Reload the page at midnight
  useEffect(() => {
    reloadAtMidnight();
  }, []);
  const showLeaves = () => {
    navigate("/clock-details");
  };
  return (
    <div className=" rounded-sm ml-2 lg:ml-0 p-2 mb-4 flex min-h-screen w-full flex-col ml-4 lg:ml-0 ">
      {/* Main Content */}
      <div className="container px-4 py-6 lg:px-8 flex-1 overflow-y-auto">
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-wrap gap-4">
            {/* Clock In / Clock Out Button */}
            <button
              onClick={isClockedIn ? handleClockOut : handleClockIn}
              disabled={isOnBreak}
              className={`px-6 py-3 rounded-md font-semibold text-white transition duration-300 ${
                isClockedIn
                  ? "bg-red-500 hover:bg-red-600 disabled:bg-red-300"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {isClockedIn ? (
                <span className="flex items-center gap-2">
                  <i className="material-icons"></i> Clock Out
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <i className="material-icons"></i> Clock In
                </span>
              )}
            </button>

            {/* Start Break Button */}
            {!isOnBreak && (
              <button
                onClick={handleStartBreak}
                className="px-6 py-3 rounded-md font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition duration-300"
              >
                <span className="flex items-center gap-2">
                  <i className="material-icons"></i> Start Break
                </span>
              </button>
            )}

            {/* End Break Button */}
            {isOnBreak && (
              <button
                onClick={handleEndBreak}
                className="px-6 py-3 rounded-md font-semibold text-white bg-red-500 hover:bg-red-600 transition duration-300"
              >
                <span className="flex items-center gap-2">
                  <i className="material-icons"></i> End Break
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-center w-full md:w-64">
            <div className="font-bold text-2xl text-gray-800">
              <span className="text-indigo-500">Your</span> {companyName}
            </div>
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
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">
                      {clockInTime ? clockInTime.toLocaleTimeString() : "--:--"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Today's In Time
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">
                      {formatDuration(breakDuration)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Break Time
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
                    <div className="text-xl font-bold">
                      {formatDuration(workDuration)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Work Time
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="mt-4 px-4 py-2 text-blue-500 hover:underline transition"
                onClick={showLeaves}
              >
                View My Statistics
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
                onClick={() => navigate("/chat")}
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
              onClick={() => navigate("/meetings")}
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

export default Component;
