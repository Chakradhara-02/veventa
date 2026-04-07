import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VeventaContext } from '../utils/context';
import bcryptjs from 'bcryptjs';

const { mockUserStore } = vi.hoisted(() => ({
  mockUserStore: new Map<string, any>(),
}));

vi.mock('../models/User', () => {
  class MockUser {
    _id: { toString: () => string };
    name: string;
    email: string;
    password?: string;
    role: 'participant' | 'organizer' | 'admin';
    avatar?: string;
    bio?: string;
    interests: string[];
    joinDate: Date;
    eventsAttended: number;
    eventsCreated?: number;
    lastSignedIn: Date;

    constructor(data: any) {
      const id = data._id || `${Date.now()}-${Math.random()}`;
      this._id = { toString: () => String(id) };
      this.name = data.name;
      this.email = data.email;
      this.password = data.password;
      this.role = data.role;
      this.avatar = data.avatar;
      this.bio = data.bio;
      this.interests = data.interests || [];
      this.joinDate = data.joinDate || new Date();
      this.eventsAttended = data.eventsAttended || 0;
      this.eventsCreated = data.eventsCreated || 0;
      this.lastSignedIn = data.lastSignedIn || new Date();
    }

    async comparePassword(candidatePassword: string): Promise<boolean> {
      return bcryptjs.compare(candidatePassword, this.password || '');
    }

    async save() {
      if (this.password && !this.password.startsWith('$2')) {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
      }
      mockUserStore.set(this._id.toString(), this);
      return this;
    }

    static async findOne(query: any) {
      for (const user of mockUserStore.values()) {
        if (query.email && user.email === query.email) return user;
      }
      return null;
    }

    static async findById(id: string) {
      return mockUserStore.get(String(id)) || null;
    }

    static async findByIdAndUpdate(id: string, updates: any) {
      const user = mockUserStore.get(String(id));
      if (!user) return null;

      if (updates.name !== undefined) user.name = updates.name;
      if (updates.bio !== undefined) user.bio = updates.bio;
      if (updates.interests !== undefined) user.interests = updates.interests;

      mockUserStore.set(String(id), user);
      return user;
    }
  }

  return { User: MockUser };
});

import { authRouter } from './auth';
import { User } from '../models/User';

// Mock context
const createMockContext = (user?: any): VeventaContext => ({
  req: {} as any,
  res: {} as any,
  user: user || null,
});

describe('Auth Router', () => {
  beforeEach(() => {
    mockUserStore.clear();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const caller = authRouter.createCaller(createMockContext());

      const result = await caller.register({
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        role: 'participant',
      });

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.name).toBe('Test User');
      expect(result.token).toBeDefined();
    });

    it('should fail if email already exists', async () => {
      const email = `duplicate-${Date.now()}@example.com`;
      const caller = authRouter.createCaller(createMockContext());

      // Register first user
      await caller.register({
        name: 'User 1',
        email,
        password: 'password123',
        role: 'participant',
      });

      // Try to register with same email
      try {
        await caller.register({
          name: 'User 2',
          email,
          password: 'password456',
          role: 'participant',
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('CONFLICT');
      }
    });

    it('should hash password before saving', async () => {
      const caller = authRouter.createCaller(createMockContext());
      const password = 'testpassword123';

      const result = await caller.register({
        name: 'Password Test',
        email: `pwd-test-${Date.now()}@example.com`,
        password,
        role: 'participant',
      });

      const user = await User.findById(result.user.id);
      expect(user?.password).not.toBe(password);
      expect(user?.password).toBeDefined();
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const email = `login-test-${Date.now()}@example.com`;
      const password = 'correctpassword';

      // First register
      const registerCaller = authRouter.createCaller(createMockContext());
      await registerCaller.register({
        name: 'Login Test',
        email,
        password,
        role: 'participant',
      });

      // Then login
      const loginResult = await registerCaller.login({
        email,
        password,
      });

      expect(loginResult.success).toBe(true);
      expect(loginResult.user.email).toBe(email);
      expect(loginResult.token).toBeDefined();
    });

    it('should fail with incorrect password', async () => {
      const email = `wrong-pwd-${Date.now()}@example.com`;
      const caller = authRouter.createCaller(createMockContext());

      await caller.register({
        name: 'Wrong Password Test',
        email,
        password: 'correctpassword',
        role: 'participant',
      });

      try {
        await caller.login({
          email,
          password: 'wrongpassword',
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('UNAUTHORIZED');
      }
    });

    it('should fail if user does not exist', async () => {
      const caller = authRouter.createCaller(createMockContext());

      try {
        await caller.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('UNAUTHORIZED');
      }
    });
  });

  describe('me', () => {
    it('should return current user profile', async () => {
      const email = `me-test-${Date.now()}@example.com`;
      const registerCaller = authRouter.createCaller(createMockContext());

      const registerResult = await registerCaller.register({
        name: 'Me Test User',
        email,
        password: 'password123',
        role: 'organizer',
      });

      const user = await User.findById(registerResult.user.id);
      const mockContext = createMockContext({
        userId: registerResult.user.id,
        email,
        role: 'organizer',
      });

      const meCaller = authRouter.createCaller(mockContext);
      const meResult = await meCaller.me();

      expect(meResult.name).toBe('Me Test User');
      expect(meResult.email).toBe(email);
      expect(meResult.role).toBe('organizer');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const email = `update-test-${Date.now()}@example.com`;
      const registerCaller = authRouter.createCaller(createMockContext());

      const registerResult = await registerCaller.register({
        name: 'Original Name',
        email,
        password: 'password123',
        role: 'participant',
      });

      const mockContext = createMockContext({
        userId: registerResult.user.id,
        email,
        role: 'participant',
      });

      const updateCaller = authRouter.createCaller(mockContext);
      const updateResult = await updateCaller.updateProfile({
        name: 'Updated Name',
        bio: 'New bio',
        interests: ['Technology', 'Music'],
      });

      expect(updateResult.success).toBe(true);
      expect(updateResult.user.name).toBe('Updated Name');
    });
  });
});
