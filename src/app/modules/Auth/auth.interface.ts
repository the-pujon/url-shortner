import { Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "admin" | "customer" | "superAdmin" | "moderator" | "seller";
  lastLogin: Date;
  isVerified: Boolean;
  resetPasswordToken: String;
  resetPasswordExpiresAt: Date;
  verificationToken: String;
  verificationTokenExpiresAt: Date;
}

export interface ILoginUser {
  email: string;
  password: string;
}


export interface IUserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser | null>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
