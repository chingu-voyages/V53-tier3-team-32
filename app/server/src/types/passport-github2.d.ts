// types/passport-github2.d.ts
declare module "passport-github2" {
  import { Strategy as PassportStrategy } from "passport";
  import { Request } from "express";

  export interface Profile {
    id: string;
    username: string;
    displayName: string;
    emails?: Array<{ value: string }>;
    photos?: Array<{ value: string }>;
  }

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
  }

  export class Strategy extends PassportStrategy {
    constructor(
      options: StrategyOptions,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void
      ) => void
    );
  }
}
