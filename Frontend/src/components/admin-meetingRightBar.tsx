import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";
import { IMeeting, MeetingProps, Member } from "../apiTypes/apiTypes";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import moment from "moment";
import {
  fetchMeetingsByProject,
  getProjectMembers,
  scheduleMeeting,
  updateMeetingStatus,
} from "../services/adminApi/adminAuthService";

const AdminMeetingPageRight: React.FC<MeetingProps> = ({ selectedProject }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meetingTime, setMeetingTime] = useState<string>("");
  const [assignees, setAssignees] = useState<Member[]>([]);
  const [roomId] = useState<string>(uuidv4()); // Generate a unique roomId
  const [meetings, setMeetings] = useState<IMeeting[]>([]);

  const fetchProjectMembers = async (projectId: string) => {
    try {
      const data = await getProjectMembers(projectId);
      setAssignees(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch project members.");
      }
    }
  };

  const fetchMeetings = async () => {
    if (!selectedProject) return;

    try {
      const data = await fetchMeetingsByProject(selectedProject._id);
      setMeetings(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch meetings.");
      }
    }
  };

  const handleUpdateStatus = async (meetingId: string, status: string) => {
    const meetingData = {
      meetingId: meetingId,
      status: status,
    };

    try {
      const updatedMeeting = await updateMeetingStatus({ meetingId, status });
      setMeetings((prevMeetings: IMeeting[]) =>
        prevMeetings.map((meeting) =>
          meeting._id === meetingId ? updatedMeeting : meeting
        )
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleMeeting = async () => {
    try {
      const currentTime = new Date();
      const selectedMeetingTime = new Date(meetingTime);
      if (selectedMeetingTime < currentTime) {
        toast.error("The meeting time cannot be in the past.");
        return;
      }
      if (selectedProject && meetingTime) {
        const data = await scheduleMeeting(
          selectedProject._id,
          meetingTime,
          roomId
        );
        setMeetings([...meetings, data]);
        const formattedTime = moment(data.MeetingTime)
          .local()
          .format("MMMM Do YYYY, h:mm A");
        toast.success(
          `The ${selectedProject.name} project meeting is scheduled at ${formattedTime}`
        );
        handleCloseModal();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleOpenModal = () => {
    if (selectedProject) {
      fetchProjectMembers(selectedProject?._id); // Fetch members when modal opens
      setIsModalOpen(true);
    }
  };

  const handleJoinMeeting = (roomId: string) => {
    navigate("/videoCall", { state: { roomId } });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchMeetings();
    }
  }, [selectedProject]);

  useEffect(() => {}, [isModalOpen]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeetingTime(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen bg-[#EDEDFF]">
      {/* Header Section */}
      {selectedProject && (
        <header className="flex items-center justify-between lg:p-4 p-1 bg-white border-b shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">
                {selectedProject?.name?.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-800">
                {selectedProject?.name || "Select A project"}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Video Call Button */}
            <button
              className="p-2 rounded-full hover:bg-gray-200"
              aria-label="Video Call"
            >
              <Video className="w-5 h-5" />
            </button>
            {/* Create Video Call Option */}
            <button
              onClick={handleOpenModal}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
            >
              Create Video Call
            </button>
          </div>
        </header>
      )}
      {/* Meeting List Section */}

      <div className="flex-1 overflow-y-auto p-4">
        {meetings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetings
              .slice() // To avoid mutating the original array
              .reverse()
              .map((meeting) => {
                const meetingTime = new Date(meeting.MeetingTime);
                const currentTime = new Date();
                const isMeetingTimeOver = currentTime > meetingTime;

                return (
                  <div
                    key={meeting._id}
                    className={`p-4 rounded-md shadow-lg ${
                      meeting.status === "completed"
                        ? "bg-gray-100 opacity-75"
                        : meeting.status === "cancelled"
                        ? "bg-red-50 opacity-75"
                        : "bg-blue-50"
                    }`}
                  >
                    <div className="flex flex-col space-y-2">
                      {/* Meeting Status */}
                      <p className="text-sm text-gray-700">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`${
                            meeting.status === "completed"
                              ? "text-gray-500"
                              : meeting.status === "cancelled"
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {meeting.status
                            ? meeting.status.charAt(0).toUpperCase() +
                              meeting.status.slice(1)
                            : "Unknown"}
                        </span>
                      </p>

                      {/* Meeting Time */}
                      <p className="text-sm text-gray-700">
                        <strong>Meeting Time:</strong>{" "}
                        {meetingTime.toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>

                      {/* Participants */}
                      <p className="text-sm text-gray-700">
                        <strong>Participants:</strong>
                      </p>
                      <ul className="list-disc pl-4 text-sm text-gray-600">
                        {meeting.members.map((member) => (
                          <li key={member._id}>
                            {member.email} ({member.role})
                          </li>
                        ))}
                      </ul>

                      {/* Buttons Section */}
                      {meeting.status === "cancelled" ? (
                        <button
                          onClick={() =>
                            handleUpdateStatus(meeting._id, "active")
                          }
                          className="mt-2 px-3 py-1 text-sm text-white bg-green-500 rounded-md hover:bg-green-600"
                        >
                          Set Active
                        </button>
                      ) : meeting.status === "completed" ? (
                        <p className="text-sm text-gray-500 font-bold">
                          This meeting has been completed.
                        </p>
                      ) : (
                        <>
                          {/* Show "Mark as Completed" button only if the meeting time has passed */}
                          {isMeetingTimeOver && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(meeting._id, "completed")
                              }
                              className="mt-2 px-3 py-1 text-sm text-white bg-gray-500 rounded-md hover:bg-gray-600"
                            >
                              Mark as Completed
                            </button>
                          )}

                          {/* Join and Cancel Buttons for Active Meetings */}
                          <button
                            onClick={() => handleJoinMeeting(meeting.roomId)}
                            className="mt-2 px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                          >
                            Join Meeting
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(meeting._id, "cancelled")
                            }
                            className="mt-2 px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                          >
                            Cancel Meeting
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center bg-[#EDEDFF] h-screen space-y-6">
            <h1 className="text-4xl font-extrabold text-indigo-600">
              Welcome to
              <span className="block lg:text-center text-center">Projec-X</span>
            </h1>
            {!selectedProject && (
              <p className="text-lg text-gray-500">
                No project selected. Please select a project to create meetings.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal for Scheduling a Meeting */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center  z-50 justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Schedule a Meeting</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Time
              </label>
              <input
                type="datetime-local"
                value={meetingTime}
                onChange={handleTimeChange}
                className="w-full p-2 border rounded-md mb-4"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participants
              </label>
              <ul className="space-y-2">
                {assignees.map((assignee) => (
                  <li key={assignee._id} className="text-sm text-gray-700">
                    {assignee.email} ({assignee.role})
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                Close
              </button>
              <button
                onClick={handleMeeting}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMeetingPageRight;
