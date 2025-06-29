import mongoose, { InferSchemaType, Schema, Types, model } from "mongoose";
import { IUser } from "../Interfaces/commonInterface";

const userSchema= new Schema({
  user_id: {
    type: String,
    required:true
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
    default: null,
  },
  address: {
    type: String,
  },
  state: {
    type: String,
  },
  city:{
    type:String,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  refferalCode: {
    type: String,
  },
  position: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export type UserInput = InferSchemaType<typeof userSchema>
export type UserDoc = UserInput & {_id?:Types.ObjectId};

const userModel = model<UserDoc>("User",userSchema);

export default userModel
