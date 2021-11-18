import { ObjectType, Field } from "type-graphql";
@ObjectType()
export class ActionRespond {
  @Field(() => String)
  msg: string;

  @Field(() => String)
  status: string;
}

@ObjectType()
export class LoginRespond {
  @Field()
  token: string;

  @Field()
  isSuccess: boolean;
}
