import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class UserType {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  username: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;
}
