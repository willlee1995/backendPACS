import { Schema, model } from "mongoose"
import Paginator from  "mongoose-paginate-v2"

const TaskSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    deadline: {
        type: Date,
        required: false
    },
    location: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: false
    },
    issuer: {
        ref: "users",
        type: Schema.Types.ObjectId,
        required: true
    },
    handler: {
        ref: "users",
        type: Schema.Types.ObjectId,
        required: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users"
    }
}, {timestamps: true})

TaskSchema.plugin(Paginator);

const Task = model("tasks", TaskSchema)

export default Task