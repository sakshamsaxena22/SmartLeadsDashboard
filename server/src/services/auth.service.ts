import { User, IUserDocument } from '../models/User.model';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { RegisterSchemaType, LoginSchemaType } from '../../../shared/validators';
import { AuthResponse, UserRole } from '../../../shared/types';

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export const authService = {
  async register(data: RegisterSchemaType): Promise<{ auth: AuthResponse; refreshToken: string }> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('A user with this email already exists.', 409);
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: (data.role as UserRole) || UserRole.SALES,
    });

    const tokenPayload = { userId: (user._id as any).toString(), role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      auth: {
        user: {
          _id: (user._id as any).toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
      refreshToken,
    };
  },

  async login(data: LoginSchemaType): Promise<{ auth: AuthResponse; refreshToken: string }> {
    const user = await User.findOne({ email: data.email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    const tokenPayload = { userId: (user._id as any).toString(), role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      auth: {
        user: {
          _id: (user._id as any).toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
      refreshToken,
    };
  },

  async getMe(userId: string): Promise<IUserDocument> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return user;
  },
};
