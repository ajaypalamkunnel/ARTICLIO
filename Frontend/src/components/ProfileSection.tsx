import { Calendar, Edit3, Mail, Phone } from "lucide-react";
import type { GetUserProfileResponseDTO } from "../types/user";
import { dateFormatter } from "../utils/dateFormatter";

const ProfileSection: React.FC<{
  user: GetUserProfileResponseDTO;
  onEditProfile: () => void;
}> = ({ user, onEditProfile }) => {

    if(user){
        console.log("----->",user);
    }else{
        console.log("helllo");
        
    }


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>
        <button
          onClick={onEditProfile}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <p className="text-gray-800 font-medium">{user.firstName} {user.lastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <p className="text-gray-800">{user.email}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <p className="text-gray-800">{user?.phone}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <p className="text-gray-800">{dateFormatter(user.dob)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">Preferences</label>
        <div className="flex flex-wrap gap-2">
          {user.preferences.map((pref) => (
            <span
              key={pref._id}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {pref.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};


export default ProfileSection