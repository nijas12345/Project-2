import { useEffect, useState } from "react";
import { Project, ProjectSidebarProps } from "../apiTypes/apiTypes";
import MeetingChatbar from "../components/meetingChatBar";
import AdminLeftNavBar from "../components/admin-left-nav";
import AdminMeetingPageRight from "../components/admin-meetingRightBar";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogout } from "../redux/Slices/UserAuth";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { getMeetingProjects } from "../services/adminApi/adminAuthService";

const AdminMeetingPage: React.FC<ProjectSidebarProps> = ({
  initialProjects = [],
}) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getMeetingProjects(); // calling your service method
      setProjects(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = error.message;

        if (message === "Access denied. User is blocked.") {
          toast.error(message);
          setTimeout(() => {
            dispatch(userLogout());
            navigate("/login");
          }, 3000);
        } else {
          toast.error(message || "Failed to fetch projects.");
          setError(message || "Failed to fetch projects.");
        }
      } else {
        toast.error("An unexpected error occurred.");
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsSidebarOpen(!setIsSidebarOpen);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="flex h-screen">
      <button
        onClick={toggleSidebar}
        className="fixed top-4 w-12 h-10 left-0 z-50 p-0 bg-[#EDEDFF] rounded shadow-md md:hidden"
      >
        <Bars3Icon className="w-6 h-6 ml-3 text-gray-600" />
      </button>
      <div
        className={` z-40 inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-1"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 w-[4.5%] bg-white shadow-md md:shadow-none`}
      >
        <AdminLeftNavBar />
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed z-20 inset-y-0 lg:left-[0.3%] left-[15%] transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 w-[22%] bg-white shadow-md md:shadow-none`}
        style={{
          width: isSidebarOpen ? "85%" : "22%",
        }}
      >
        {" "}
        <MeetingChatbar
          projects={projects}
          setSelectedProject={setSelectedProject}
          onProjectSelect={handleProjectSelect}
        />
      </div>

      <div className="flex-1 ml-10 sm:ml-0">
        <AdminMeetingPageRight selectedProject={selectedProject} />
      </div>
    </div>
  );
};

export default AdminMeetingPage;
