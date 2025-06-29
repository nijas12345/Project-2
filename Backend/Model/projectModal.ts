import { Schema ,InferSchemaType,model,Types} from "mongoose";

const memberSchema =  new Schema({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Member"],
  },
});

const projectSchema =  new Schema({
  name: {
    type: String,
    required:true
  },
  description: {
    type: String,
    required:true
  },
  admin_id: {
    type: String,
    ref: "Admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  members: [memberSchema],
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
});

export type   MemberInput = InferSchemaType<typeof memberSchema>
export type MemberDoc = MemberInput & {_id:Types.ObjectId}

export type ProjectInput = InferSchemaType<typeof projectSchema>
export type ProjectDoc = ProjectInput & {_id:Types.ObjectId}

const projectModel = model<ProjectDoc>('Project',projectSchema)

export default projectModel