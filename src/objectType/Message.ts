import { ObjectType, Field } from "type-graphql";
@ObjectType()
export class Message {
  @Field(() => String)
  msg: string;

  @Field(() => String)
  status: string;
}
