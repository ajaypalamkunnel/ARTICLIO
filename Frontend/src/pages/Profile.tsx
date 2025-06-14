import { useEffect, useState } from "react";
import ChangePasswordSection from "../components/ChangePasswordSection";
import EditProfileModal from "../components/EditProfileModal";
import Navigation from "../components/Navigation";
import ProfileSection from "../components/ProfileSection";
import type { GetUserProfileResponseDTO } from "../types/user";
import { getMyArticles, getProfile } from "../services/userService";
import { toast } from "react-toastify";
import type {
  ArticleResponseDTO,
} from "../types/article";
import MyArticlesPage from "../components/MyArticles";

const Profile: React.FC = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [user, setUser] = useState<GetUserProfileResponseDTO | null>(null);
  const [myArticles, setMyArticles] = useState<ArticleResponseDTO[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // <-- loading state

  console.log("hello");

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await getProfile();
        console.log(">>>>>", response.data);

        if (response.success && response?.data) {
          setUser(response.data?.data);
        } else {
          toast("Profile not available");
        }
      } catch (error) {
        console.log("Profile fetching error: ", error);
        toast("Profile data not available");
      } finally {
        setLoading(false); // <-- mark loading complete
      }
    };
    getUserProfile();
  }, []);

  useEffect(() => {
    const fetchMyArticles = async () => {
      try {
        const response = await getMyArticles();
        console.log("****>", response.data?.articles);

        if (response.success && response.data?.articles) {
          setMyArticles(response.data?.articles);
        } else {
          toast("Profile not available");
        }
      } catch (error) {
        console.log("Profile fetching error: ", error);
        toast("Profile data not available");
      } finally {
        setLoading(false);
      }
    };

    fetchMyArticles();
  }, []);

  const handleSaveProfile = async () => {
    // simply re-fetch profile after modal closes
    const response = await getProfile();
    console.log(">>>>>", response.data);

    if (response.success && response?.data) {
      setUser(response.data?.data);
    } else {
      toast("Profile not available");
    }
    setIsEditModalOpen(false);
  };
  const renderContent = () => {
    if (loading) {
      return <p>Loading profile...</p>;
    }

    if (!user) {
      return <p>Profile data not found.</p>;
    }

    switch (activeSection) {
      case "profile":
        return (
          <ProfileSection
            user={user}
            onEditProfile={() => setIsEditModalOpen(true)}
          />
        );
      case "articles":
        return <MyArticlesPage articles={myArticles!} />;
      case "password":
        return <ChangePasswordSection />;
      default:
        return (
          <ProfileSection
            user={user}
            onEditProfile={() => setIsEditModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">{renderContent()}</div>
      </main>

      <EditProfileModal
        isOpen={isEditModalOpen}
        user={user!}
        onClose={handleSaveProfile}
        // onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profile;
