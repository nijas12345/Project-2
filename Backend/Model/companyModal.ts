import { Schema, InferSchemaType, model, HydratedDocument, Types } from "mongoose";

// Member Schema
const memberSchema = new Schema({
  email: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Member"] },
  status: { type: String, default: "pending" },
  invitedAt: { type: Date, default: Date.now },
});

// Company Schema
const companySchema = new Schema({
  companyName: { type: String, required: true },
  description: { type: String, required: true },
  refferalCode: { type: String, required: true },
  members: [memberSchema],
});


export type CompanyMemberInput = InferSchemaType<typeof memberSchema>
export type CompanyMemberDoc = CompanyMemberInput & {_id:Types.ObjectId}
export type CompanyInput = InferSchemaType<typeof companySchema>;
export type CompanyDoc = CompanyInput & {_id:Types.ObjectId}
export type CompanyUpdateInput = CompanyInput & { _id: Types.ObjectId | string };



const CompanyModel = model<CompanyDoc>("Company", companySchema);
 
export default CompanyModel