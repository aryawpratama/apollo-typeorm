import { Request, Response } from "express";

export interface IAuthContext {
  req: Request;
  res: Response;
  payload?: {
    firstName: string;
    lastName: string;
    id: number;
    role: number;
  };
}
