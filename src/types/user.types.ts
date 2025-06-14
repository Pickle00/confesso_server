export interface CreateUserDto {
  email: string;
  password: string;
  username: string;
  profilePicture?: string;
}

export interface UpdateUserDto {
  username?: string;
  profilePicture?: string;
  isActive?: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}