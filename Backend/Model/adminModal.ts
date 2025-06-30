import { Schema, model, InferSchemaType, Types } from "mongoose";

const adminSchema = new Schema({
  admin_id: {
    type: String,
    required: true,
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
  companyId: {
    type: String,
  },
  position: {
    type: String,
  },
  city: {
    type: String,
  },
});

export type AdminInput = InferSchemaType<typeof adminSchema>;
export type AdminDoc = AdminInput & { _id?: Types.ObjectId };
const Admin = model<AdminDoc>("Admin", adminSchema);
export default Admin;
