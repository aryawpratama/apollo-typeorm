import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entity/UserEntity";
import { CreateUser, GetUser, UpdateUser } from "../inputs/User";
import { Message } from "../objectType/Message";
import { UserType } from "../objectType/User.type";

@Resolver()
export class UserResolver {
  @Query(() => [UserType])
  async getUsers() {
    const user = await User.find();
    return user;
  }

  @Query(() => [UserType])
  async getUser(@Args() { firstName, id, lastName, username }: GetUser) {
    const query = User.createQueryBuilder();
    query.where(id ? "User.id = :id" : "1=1", { id });
    query.andWhere(firstName ? "User.firstName = :firstName" : "1=1", {
      firstName,
    });
    query.andWhere(lastName ? "User.lastName = :lastName" : "1=1", {
      lastName,
    });
    query.andWhere(username ? "User.username = :username" : "1=1", {
      username,
    });
    const data = await query.getMany();
    console.log(data);

    return data;
  }

  @Mutation(() => UserType)
  async createUser(@Arg("data") data: CreateUser) {
    const createdUser = User.create(data);
    await User.save(createdUser);
    return createdUser;
  }

  @Mutation(() => UserType)
  async updateUser(@Arg("data") data: UpdateUser, @Arg("id") id: number) {
    const target = User.findOne({ where: { id } });
    const updatedUser = Object.assign(target, data);
    await User.update({ id }, updatedUser);
    return updatedUser;
  }

  @Mutation(() => Message)
  async deleteUser(@Arg("id") id: number) {
    const target = await User.findOne({ where: { id } });
    if (!target) throw new Error("User not found!");
    await target.remove();
    return {
      status: "success",
      msg: `User ${target.username} has been removed!`,
    };
  }
}
