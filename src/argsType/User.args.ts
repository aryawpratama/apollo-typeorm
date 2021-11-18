import { Field, InputType, ArgsType, Int } from "type-graphql";

@ArgsType()
export class GetUser {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;
}

@InputType()
export class CreateUser {
  @Field()
  username: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  password: string;
}

@InputType()
export class UpdateUser {
  @Field()
  username?: string;

  @Field()
  firstName?: string;

  @Field()
  lastName?: string;

  @Field()
  password?: string;
}

@InputType()
export class UserLogin {
  @Field()
  username: string;

  @Field()
  password: string;
}

@InputType()
export class UserRegister {
  @Field()
  username: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  password: string;
}
