// types/passport-google-oauth20.d.ts
declare module "passport-google-oauth20" {
  import { Strategy as PassportStrategy } from "passport";
  import { Request } from "express";

  export interface Profile {
    id: string;
    displayName: string;
    name?: {
      familyName: string;
      givenName: string;
    };
    emails?: Array<{ value: string; verified: boolean }>;
    photos?: Array<{ value: string }>;
  }

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
  }

  export interface StrategyOptionsWithRequest {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    passReqToCallback: true;
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

    constructor(
      options: StrategyOptionsWithRequest,
      verify: (
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void
      ) => void
    );
  }

  export type VerifyCallback = (error: any, user?: any) => void;
}
