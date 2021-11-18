import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entites/User.entity";
import {
  CreateUser,
  GetUser,
  UpdateUser,
  UserLogin,
  UserRegister,
} from "../argsType/User.args";
import { ActionRespond, LoginRespond } from "../objectTypes/Respond.type";
import { authMiddleware } from "../middlewares/auth.middleware";
import { IAuthContext } from "../contexts/auth.context";
import { compare, hash } from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
  setNewRefreshToken,
} from "../helpers/auth.helper";
import { AuthenticationError, ForbiddenError } from "apollo-server-errors";

type registerUser = {
  username: string;
  firstName: string;
  role: number;
  lastName: string;
  password: string;
};

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    const user = await User.find();
    return user;
  }

  @Query(() => User)
  @UseMiddleware(authMiddleware)
  async getUserInfo(@Ctx() { payload }: IAuthContext): Promise<User> {
    const user = await User.findOne({ id: payload.id });
    return user;
  }

  @Query(() => [User])
  async getUser(
    @Args() { firstName, id, lastName, username }: GetUser
  ): Promise<User[]> {
    const query = User.createQueryBuilder();
    if (id) {
      query.orWhere({ id });
    }
    if (username) {
      query.orWhere({ username });
    }
    if (firstName) {
      query.orWhere({ firstName });
    }
    if (lastName) {
      query.orWhere({ lastName });
    }
    const data = await query.getMany();
    console.log(data);

    return data;
  }

  @Mutation(() => LoginRespond)
  async login(
    @Arg("data") data: UserLogin,
    @Ctx() { res }: IAuthContext
  ): Promise<LoginRespond> {
    const { password, username } = data;
    const user = await User.findOne({ username });
    if (!user) {
      throw new AuthenticationError("User doesn't exist");
    }
    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new AuthenticationError("Password doesn't match");
    }
    setNewRefreshToken(res, createRefreshToken(user));
    return { isSuccess: true, token: createAccessToken(user) };
  }

  @Mutation(() => ActionRespond)
  async register(@Arg("data") data: UserRegister): Promise<ActionRespond> {
    const hashedPassword = await hash(data.password, 12);
    const registerData: registerUser = {
      ...data,
      password: hashedPassword,
      role: 1,
    };
    const registerUser = User.create(registerData);
    try {
      await User.save(registerUser);
    } catch (err) {
      throw new Error("Failed to register");
    }
    return {
      msg: "Registration Success",
      status: "success",
    };
  }

  @Mutation(() => User)
  async createUser(@Arg("data") data: CreateUser): Promise<User> {
    const hashedPassword = await hash(data.password, 12);
    const createData: registerUser = {
      ...data,
      password: hashedPassword,
      role: 0,
    };
    const createdUser = User.create(createData);
    try {
      await User.save(createdUser);
    } catch (err) {
      throw new Error("Failed to register");
    }
    await User.save(createdUser);
    return createdUser;
  }

  @Mutation(() => User)
  @UseMiddleware(authMiddleware)
  async updateUser(
    @Arg("data") data: UpdateUser,
    @Ctx() { payload }: IAuthContext
  ): Promise<User> {
    const target = User.findOne({ where: { id: payload.id } });
    const updatedUser = Object.assign(target, data);
    await User.update({ id: payload.id }, updatedUser);
    return updatedUser;
  }

  @Mutation(() => ActionRespond)
  @UseMiddleware(authMiddleware)
  async deleteUser(
    @Arg("id") id: number,
    @Ctx() { payload }: IAuthContext
  ): Promise<ActionRespond> {
    if (payload.role !== 0) {
      throw new ForbiddenError("Unauthorized Action!");
    }
    const target = await User.findOne({ where: { id } });
    if (!target) throw new Error("User not found!");
    await target.remove();
    if (target.role === 0) {
      throw new ForbiddenError("Unauthorized Action");
    }
    return {
      status: "success",
      msg: `User ${target.username} has been removed!`,
    };
  }
}
