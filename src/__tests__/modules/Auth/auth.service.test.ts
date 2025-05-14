// import { AuthServices } from '../../../app/modules/Auth/auth.service';
// import { User } from '../../../app/modules/Auth/auth.model';
// import { UserRole, IUser } from '../../../app/modules/Auth/auth.interface';
// import { AUTH_CONFIG } from '../../../app/modules/Auth/auth.config';
// import { cacheData, deleteCachedData, getCachedData } from '../../../app/utils/redis.utils';
// import { sendEmail } from '../../../app/utils/sendEmail';
// import AppError from '../../../app/errors/AppError';
// import httpStatus from 'http-status';

import httpStatus from "http-status";
import AppError from "../../../app/errors/AppError";
import { IUser } from "../../../app/modules/Auth/auth.interface";
import { User } from "../../../app/modules/Auth/auth.model";
import { AuthServices } from "../../../app/modules/Auth/auth.service";


jest.mock('../../../app/modules/Auth/auth.model');
jest.mock('../../../app/utils/redis.utils');
jest.mock('../../../app/utils/sendEmail',()=>{
  return {
    sendEmail: jest.fn().mockResolvedValue(undefined),
    getEmailTemplate: jest.fn().mockReturnValue('Mocked email template')
  }
});

// // Mock dependencies
// jest.mock('../../../app/modules/Auth/auth.model');
// jest.mock('../../../app/utils/redis.utils');
// jest.mock('../../../app/utils/sendEmail', () => ({
//   sendEmail: jest.fn().mockResolvedValue(undefined),
//   getEmailTemplate: jest.fn().mockReturnValue('Mocked email template')
// }));

// describe('AuthService', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('signupUser', () => {
//     const mockUserData: Partial<IUser> = {
//       name: 'Test User',
//       email: 'test@example.com',
//       password: 'Test@123456',
//       phone: '1234567890',
//       accountLocked: false,
//       failedLoginAttempts: 0
//     };

//     it('should create a new user successfully', async () => {
//       (User.isUserExistsByEmail as jest.Mock).mockResolvedValue(null);
//       (User.create as jest.Mock).mockResolvedValue(mockUserData);
//       (cacheData as jest.Mock).mockResolvedValue(undefined);

//       const result = await AuthServices.signupUser(mockUserData as IUser);

//       expect(User.isUserExistsByEmail).toHaveBeenCalledWith(mockUserData.email);
//       expect(User.create).toHaveBeenCalledWith(mockUserData);
//       expect(cacheData).toHaveBeenCalled();
//       expect(result).toEqual({ newUser: mockUserData });
//     });

//     it('should throw error if user already exists', async () => {
//       (User.isUserExistsByEmail as jest.Mock).mockResolvedValue(mockUserData);

//       await expect(AuthServices.signupUser(mockUserData as IUser))
//         .rejects.toThrow(new AppError(httpStatus.BAD_REQUEST, 'User already exists'));
//     });
//   });

//   // describe('verifyEmail', () => {
//   //   it('should verify email successfully', async () => {
//   //     const email = 'test@example.com';
//   //     const code = '123456';

//   //     const mockVerificationData = {
//   //       code,
//   //       expiresAt: Date.now() + 1000 * 60 * 10, // 10 minutes from now
//   //       attempts: 0,
//   //     };

//   //     const mockUser: IUser = {
//   //       email,
//   //       password: 'hashedpassword',
//   //       isVerified: false,
//   //       name: 'Test User',
//   //       phone: '1234567890',
//   //       role: UserRole.CUSTOMER,
//   //       lastLogin: new Date(),
//   //       accountLocked: false,
//   //       failedLoginAttempts: 0,
//   //       isAccountLocked: () => false,
//   //       incrementFailedLoginAttempts: async () => {},
//   //       resetFailedLoginAttempts: async () => {},
//   //     };

//   //     (getCachedData as jest.Mock).mockResolvedValue(mockVerificationData);
//   //     (User.findOneAndUpdate as jest.Mock).mockResolvedValue({ ...mockUser, isVerified: true });
//   //     (deleteCachedData as jest.Mock).mockResolvedValue(undefined);

//   //     const result = await AuthServices.verifyEmail(email, code);

//   //     expect(getCachedData).toHaveBeenCalled();
//   //     expect(User.findOneAndUpdate).toHaveBeenCalledWith(
//   //       { email },
//   //       { isVerified: true },
//   //       { new: true }
//   //     );
//   //     expect(deleteCachedData).toHaveBeenCalled();
//   //     expect(result.user.isVerified).toBe(true);
//   //   });

//   //   it('should throw error if verification code is invalid', async () => {
//   //     const email = 'test@example.com';
//   //     const code = '123456';

//   //     const mockVerificationData = {
//   //       code: '654321', // Different code
//   //       expiresAt: Date.now() + 1000 * 60 * 10,
//   //       attempts: 0,
//   //     };

//   //     (getCachedData as jest.Mock).mockResolvedValue(mockVerificationData);

//   //     await expect(AuthServices.verifyEmail(email, code))
//   //       .rejects.toThrow(new AppError(httpStatus.BAD_REQUEST, 'Invalid verification code'));
//   //   });
//   // });

//   // describe('loginUser', () => {
//   //   const mockLoginData = {
//   //     email: 'test@example.com',
//   //     password: 'Test@123456',
//   //   };

//   //   const createMockUser = (isPasswordMatched: boolean) => ({
//   //     ...mockLoginData,
//   //     name: 'Test User',
//   //     phone: '1234567890',
//   //     role: UserRole.CUSTOMER,
//   //     lastLogin: new Date(),
//   //     accountLocked: false,
//   //     failedLoginAttempts: 0,
//   //     isAccountLocked: jest.fn().mockReturnValue(false),
//   //     incrementFailedLoginAttempts: jest.fn(),
//   //     resetFailedLoginAttempts: jest.fn(),
//   //   });

//   //   it('should login user successfully', async () => {
//   //     const mockUser = createMockUser(true);
//   //     (User.isUserExistsByEmail as jest.Mock).mockResolvedValue(mockUser);
//   //     (User.isPasswordMatched as jest.Mock).mockResolvedValue(true);
//   //     (cacheData as jest.Mock).mockResolvedValue(undefined);
//   //     (User.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUser);

//   //     const result = await AuthServices.loginUser(mockLoginData);

//   //     expect(User.isUserExistsByEmail).toHaveBeenCalledWith(mockLoginData.email);
//   //     expect(User.isPasswordMatched).toHaveBeenCalledWith(mockLoginData.password, mockUser.password);
//   //     expect(mockUser.resetFailedLoginAttempts).toHaveBeenCalled();
//   //     expect(result).toBeDefined();
//   //     expect(result.user).toBeDefined();
//   //     expect(result.accessToken).toBeDefined();
//   //     expect(result.refreshToken).toBeDefined();
//   //   });

//   //   it('should throw error if password is incorrect', async () => {
//   //     const mockUser = createMockUser(false);
//   //     (User.isUserExistsByEmail as jest.Mock).mockResolvedValue(mockUser);
//   //     (User.isPasswordMatched as jest.Mock).mockResolvedValue(false);

//   //     await expect(AuthServices.loginUser(mockLoginData))
//   //       .rejects.toThrow(new AppError(httpStatus.FORBIDDEN, 'Wrong Password'));
//   //   });
//   // });
// });

//block of code for testing the auth service
describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // clear all the mocks before each test
  });

  describe("Signup User", () => {
    const mockUserData: Partial<IUser> = {
      name: "Test User",
      email: "test@example.com",
      password: "Test@123456",
      phone: "1234567890",
      accountLocked: false,
      failedLoginAttempts: 0,
    };

    it("should throw error if user already exists", async () => {
      (User.isUserExistsByEmail as jest.Mock).mockResolvedValue(mockUserData); // when the user is already exists then the mock data will be returned

      await expect(AuthServices.signupUser(mockUserData as IUser))
      .rejects.toThrow(new AppError(httpStatus.BAD_REQUEST, 'User already exists'));
    });


    // it('should create a new user successfully', async()=>{
    //   (User.isUserExistsByEmail as jest.Mock).mockResolvedValue(null);
    //   (User.create as jest.Mock).mockResolvedValue(mockUserData);
    // })

  });
});
