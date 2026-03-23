import { IOrder } from "./order.interface";
import { IReview } from "./review.interface";
import { IWishlistItem } from "./wishlist.interface";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface IUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile extends IUser {
  orders: IOrder[];
  wishlist: IWishlistItem[];
  reviews: IReview[];
}

export interface IAuthSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: UserRole;
    image?: string | null;
  };
  expires: string;
}

export interface IAuthCredentials {
  email: string;
  password: string;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}
