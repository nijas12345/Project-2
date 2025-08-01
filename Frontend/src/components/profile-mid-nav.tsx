import React, { useEffect, useState } from "react";
import { Camera, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/RootState/RootState";
import { UserData } from "../apiTypes/apiTypes";
import { updateProfileImage, userLogout } from "../redux/Slices/UserAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  getCompanyInfo,
  uploadProfileImage,
} from "../services/userApi/userAuthService";

const ProfileSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(
    (state: RootState): UserData | null => state.userAuth.userInfo
  );
  const [profileImage, setProfileImage] = useState<string | null>(
    userInfo?.profileImage || null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>("");

  const companyInfo = async () => {
    try {
      const data = await getCompanyInfo();
      setCompanyName(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch company info.");
      }
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("profileImage", file);

      try {
        const response = await uploadProfileImage(formData);

        if (response.status === 200) {
          const image = response.data;
          dispatch(updateProfileImage(image));
          setProfileImage(image);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message == "Access denied. User is blocked.") {
            toast.error(error.message);
            setTimeout(() => {
              navigate("/login");
              dispatch(userLogout());
            }, 3000);
          }
        }
      }
    }
  };

  return (
    <div className="h-screen flex flex-col items-center p-4 lg:h-[99vh] lg:w-64">
      <div className="bg-[#EDEDFF] rounded-sm p-3 w-full mb-4 lg:w-full text-center">
        <h1 className="text-black text-lg font-semibold">Profile</h1>
      </div>

      <div className="flex flex-col items-center w-full lg:w-auto">
        <div className="relative w-20 h-20 lg:w-28 lg:h-28 mb-4 rounded-full border-4 border-blue-900">
          <img
            src={profileImage || "/images/placeholder.jpg"}
            alt="Profile"
            className="w-full h-full rounded-full object-cover cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          <label
            htmlFor="imageUpload"
            className="absolute bottom-0 right-0 bg-white rounded-full p-1 border cursor-pointer"
          >
            <Camera className="w-4 h-4 text-gray-600" />
          </label>
        </div>

        <div className="text-center">
          <h1 className="text-lg font-semibold">
            {userInfo?.firstName?.toUpperCase()}{" "}
            {userInfo?.lastName?.toUpperCase()}
          </h1>

          <h2 className="text-xl font-bold text-gray-900 mt-2">
            {companyName}
          </h2>

          {/* Position */}
          <h2 className="text-sm text-gray-500 mt-1">
            {userInfo?.position?.toUpperCase()}
          </h2>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-white p-6 rounded-lg relative w-full max-w-md overflow-hidden max-h-[80vh]">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-center items-center h-[60vh] overflow-hidden">
              <img
                src={profileImage || "/images/placeholder.jpg"}
                alt="Profile Large"
                className="object-contain max-w-full max-h-full"
              />
            </div>
            <label
              htmlFor="imageUploadModal"
              className="block px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer text-center mt-4"
            >
              Change Image
            </label>
            <input
              id="imageUploadModal"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSidebar;
