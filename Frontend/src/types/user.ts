
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
  isVerified: boolean
  refreshToken?: string
}


export interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  dob: Date;
  email: string;
  preferences: string[];
}



// DTO to be used in both frontend & backend

export interface CategoryDTO {
  _id: string;
  name: string;
}

export interface GetUserProfileResponseDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  profileImage?: string;
  preferences: CategoryDTO[]; 
}



export interface UpdateUserProfileRequestDTO {
  firstName: string;
  lastName: string;
  phone: string;
  dob: Date | string;
  profileImage?: string;
  preferences: string[];  // Category ObjectId array from frontend
}


export interface ChangePasswordRequestDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword?:string
}
