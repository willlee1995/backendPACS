import { Schema, model } from "mongoose";
import { compare, hash, genSalt } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { SECRET } from "../constants";
import { pick } from "lodash";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum:["user", "admin", "ic"]
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  let user = this;
  if (!user.isModified("password")) return next();
  user.password = await hash(user.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (password) {
    return await compare(password, this.password);
};

UserSchema.methods.generateJWT = async function (next) {
  let payload = {
    username: this.username,
    email: this.email,
    name: this.name,
    id: this._id,
    role: this.role
  };
  return await sign(payload, SECRET, { expiresIn: "1 day" });
};

UserSchema.methods.getUserInfo = function () {
  return pick(this, ["_id", "username", "name", "email", "role"]);
};

const User = model("users", UserSchema);

export default User;
