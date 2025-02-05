export enum UserRole{
  Manager = "manager",
  Worker = "worker"
}

export interface IUser {
  googleid: string,
  githubid: string;
  username: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}
