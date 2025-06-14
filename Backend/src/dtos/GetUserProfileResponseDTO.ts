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
  dob: Date;
  profileImage?: string;
  preferences: string[];  // Category ObjectId array from frontend
}