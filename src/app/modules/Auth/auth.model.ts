import { Model, Schema, model } from 'mongoose';
import { IUser,IUserModel } from './auth.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: ['admin','customer', 'superAdmin', 'moderator', 'seller'],
      default: 'customer',
    },
    lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: {
      type: String,
			default: "",

    },
		resetPasswordExpiresAt: {
			type: Date,
			default: Date.now,
		},
		verificationToken:  {
      type: String,
			default: "",
    },
		verificationTokenExpiresAt: {
			type: Date,
			default: Date.now,
		},
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// Define the static method for isUserExistsByEmail
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUser,IUserModel>('User', userSchema);
