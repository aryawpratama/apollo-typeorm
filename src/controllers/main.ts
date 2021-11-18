import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { IAuthContext } from "../contexts/auth.context";
import { User } from "../entites/User.entity";
import {
  createAccessToken,
  createRefreshToken,
  setNewRefreshToken,
} from "../helpers/auth.helper";

export const handleRefreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.tid;
  if (!token) {
    return res.json({ err: true, token: "" });
  }
  let payload: IAuthContext["payload"] | null = null;
  try {
    payload = verify(
      token,
      process.env.REFRESH_SECRET_KEY
    ) as IAuthContext["payload"];
  } catch (err) {
    return res.send({ ok: false, accessToken: "" });
  }
  const user = await User.findOne({ id: payload.id });
  if (!user) {
    return res.json({ err: true, token: "" });
  }
  setNewRefreshToken(res, createRefreshToken(user));
  return res.send({ ok: true, accessToken: createAccessToken(user) });
};
