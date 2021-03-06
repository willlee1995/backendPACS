import { Schema, model } from "mongoose";
import Paginator from "mongoose-paginate-v2";

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    deadline: {
      type: Date,
      required: false,
    },
    location: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: false,
    },
    issuer: {
      ref: "users",
      type: String,
      required: false,
    },
    handler: {
      ref: "users",
      type: String,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    urgent: {
        type: Boolean,
        required: true
    },
    category: {
      type: String,
      default: "it support",
      enum: [
        "it support",
        "error handling",
        "documentation",
        "server maintainence",
        "stock taking",
        "external film handling",
        "export local film",
        "others"
      ],
    },
    slug: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

TaskSchema.plugin(Paginator);

TaskSchema.methods.getTaskInfo = function () {
  return pick(this, [
    "_id",
    "title",
    "status",
    "startDate",
    "issuer",
    "createdBy",
  ]);
};

const Task = model("tasks", TaskSchema);

export default Task;
