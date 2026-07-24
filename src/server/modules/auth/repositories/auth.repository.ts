import { User, IUser } from '../../../database/models/User.js';
import { Session, ISession } from '../../../database/models/Session.js';
import { EmailVerification, IEmailVerification } from '../../../database/models/EmailVerification.js';
import { PasswordReset, IPasswordReset } from '../../../database/models/PasswordReset.js';
import { AuditLog } from '../../../database/models/AuditLog.js';
import { UserResponseDto } from '../dto/auth.dto.js';

export class AuthRepository {
  async findUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase(), isDeleted: false });
  }

  async findUserByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username: username.toLowerCase(), isDeleted: false });
  }

  async findUserByEmailOrUsername(identifier: string): Promise<IUser | null> {
    const clean = identifier.trim().toLowerCase();
    return User.findOne({
      $or: [{ email: clean }, { username: clean }],
      isDeleted: false,
    }).select('+passwordHash');
  }

  async findUserById(id: string): Promise<IUser | null> {
    return User.findById(id).where({ isDeleted: false });
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async createSession(sessionData: Partial<ISession>): Promise<ISession> {
    const session = new Session(sessionData);
    return session.save();
  }

  async findSessionByTokenHash(tokenHash: string): Promise<ISession | null> {
    return Session.findOne({ refreshTokenHash: tokenHash, isValid: true, isDeleted: false });
  }

  async findActiveUserSessions(userId: string): Promise<ISession[]> {
    return Session.find({ user: userId, isValid: true, isDeleted: false }).sort({ lastActivityAt: -1 });
  }

  async revokeSessionById(sessionId: string, userId: string): Promise<boolean> {
    const result = await Session.updateOne({ _id: sessionId, user: userId }, { isValid: false, isDeleted: true, deletedAt: new Date() });
    return result.modifiedCount > 0;
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await Session.updateMany({ user: userId, isValid: true }, { isValid: false, isDeleted: true, deletedAt: new Date() });
    await User.findByIdAndUpdate(userId, { $inc: { refreshTokenVersion: 1 } });
  }

  async createEmailVerificationToken(userId: string, tokenHash: string, expiresAt: Date): Promise<IEmailVerification> {
    await EmailVerification.deleteMany({ user: userId });
    const ev = new EmailVerification({ user: userId, tokenHash, expiresAt });
    return ev.save();
  }

  async findEmailVerificationByHash(tokenHash: string): Promise<IEmailVerification | null> {
    return EmailVerification.findOne({ tokenHash, isUsed: false });
  }

  async createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<IPasswordReset> {
    await PasswordReset.deleteMany({ user: userId });
    const pr = new PasswordReset({ user: userId, tokenHash, expiresAt });
    return pr.save();
  }

  async findPasswordResetByHash(tokenHash: string): Promise<IPasswordReset | null> {
    return PasswordReset.findOne({ tokenHash, isUsed: false });
  }

  async logAudit(action: string, resource: string, reqDetails: { ip: string; userAgent: string; userId?: string; details?: unknown }): Promise<void> {
    try {
      await AuditLog.create({
        user: reqDetails.userId,
        action,
        resource,
        ipAddress: reqDetails.ip,
        userAgent: reqDetails.userAgent,
        details: reqDetails.details,
      });
    } catch {
      // Non-blocking audit failure
    }
  }

  toUserResponseDto(user: IUser): UserResponseDto {
    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl,
      companyName: user.companyName,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }
}
