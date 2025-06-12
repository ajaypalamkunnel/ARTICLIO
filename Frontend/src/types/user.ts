
export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
  articlePreferences: string[];
}


export interface IUser extends Document {
  _id: string
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  preferences: string[];
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isVerified: Boolean
  refreshToken?: string
}
