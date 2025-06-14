import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { GetUserProfileResponseDTO, UpdateUserProfileRequestDTO } from "../types/user";
import { getCategories, updateProfile } from "../services/userService";
import { toast } from "react-toastify";
import type { Category } from "../types/category";

interface EditProfileModalProps {
  isOpen: boolean;
  user: GetUserProfileResponseDTO | null;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, user, onClose }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, setValue, getValues, formState: { errors, isSubmitting } } = useForm<UpdateUserProfileRequestDTO>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      dob: "",
      preferences: [],
    }
  });

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        if (res.success && res.data?.data) {
          setCategories(res.data.data);
        } else {
          toast.error("Failed to load categories");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error loading categories");
      }
    };
    fetchCategories();
  }, []);

  // Sync user data into form when user changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        preferences: user.preferences.map(pref => pref._id),
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateUserProfileRequestDTO) => {
    try {
      setLoading(true);
      const response = await updateProfile(data);
      if (response.success) {
        toast.success("Profile updated successfully ✅");
        onClose();
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (id: string, checked: boolean) => {
    const currentPrefs = (getValues().preferences || []) as string[];
    if (checked) {
      setValue("preferences", [...currentPrefs, id]);
    } else {
      setValue("preferences", currentPrefs.filter(prefId => prefId !== id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First name is required" }}
              render={({ field }) => (
                <input {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
              )}
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Last name is required" }}
              render={({ field }) => (
                <input {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
              )}
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <Controller
              name="phone"
              control={control}
              rules={{ required: "Phone is required" }}
              render={({ field }) => (
                <input {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
              )}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <Controller
              name="dob"
              control={control}
              rules={{ required: "Date of birth is required" }}
              render={({ field }) => (
                <input
                  type="date"
                  {...field}
                  value={typeof field.value === "string" ? field.value : field.value instanceof Date ? field.value.toISOString().split('T')[0] : ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
            {errors.dob && <p className="text-sm text-red-500">{errors.dob.message}</p>}
          </div>

          {/* Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferences</label>
            <Controller
              name="preferences"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <label key={cat._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.value.includes(cat._id)}
                        onChange={(e) => handleCategoryChange(cat._id, e.target.checked)}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
