import type { Admin } from '../db/schema/admins.js';
import type { User } from '../db/schema/users.js';
import type { AuthActorType } from './enums.js';

export interface AuthContext {
  type: AuthActorType;
  apiKey: string;
  user?: Omit<User, 'password'>;
  admin?: Omit<Admin, 'password'>;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
      requestId?: string;
    }
  }
}

export {};
