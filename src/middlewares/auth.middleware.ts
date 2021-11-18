import { MiddlewareFn } from "type-graphql";
import { IAuthContext } from "../contexts/auth.context";
import { verify } from "jsonwebtoken";
import { AuthenticationError } from "apollo-server-errors";
export const authMiddleware: MiddlewareFn<IAuthContext> = (
  { context },
  next
) => {
  const auth = context.req.headers["authorization"];

  if (!auth) {
    throw new AuthenticationError("Token not provided!");
  }
  const token = auth.split(" ")[1];
  try {
    const payload = verify(token, process.env.SECRET_KEY);
    context.payload = payload as IAuthContext["payload"];
  } catch (err) {
    console.log(err);
    throw new AuthenticationError("JWT Token invalid");
  }
  return next();
};
