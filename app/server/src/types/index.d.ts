import IUser from '../models/interface/IUser';

declare global {
  namespace Express {
    interface User extends IUser {}

    interface Request {
      user?: User;
    }
  }
}