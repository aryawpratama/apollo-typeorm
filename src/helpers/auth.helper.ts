import { Response } from "express";
import { sign } from "jsonwebtoken";
import { User } from "../entites/User.entity";

export const createAccessToken = (user: User) => {
  const { firstName, lastName, id, role } = user;
  return sign({ firstName, lastName, id, role }, process.env.SECRET_KEY, {
    expiresIn: "20m",
  });
};
export const createRefreshToken = (user: User) => {
  const { firstName, lastName, id, role } = user;
  return sign({ firstName, lastName, id, role }, process.env.SECRET_KEY, {
    expiresIn: "5d",
  });
};
export const setNewRefreshToken = (res: Response, token: string) => {
  res.cookie("tid", token, {
    httpOnly: true,
    path: "/refresh_token",
  });
};
