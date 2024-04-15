import { Document, Model, Schema, model, models } from "mongoose";

export interface User extends Document {
  username: string,
  email: string,
  password: string,
  verifyToken: string,
  verifyTokenExpiry: Date,
  isVerified: boolean,
  isAcceptingDm: boolean,
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, "Please use a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Email is required"]
  },
  verifyToken: {
    type: String,
    required: [true, "VerifyToken is required"]
  },
  verifyTokenExpiry: {
    type: Date,
    required: [true, "VerifyTokenExpiry is required"]
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingDm: {
    type: Boolean,
    default: true,
  },
})

const UserModel = (models.User as Model<User>) || (model("User", UserSchema)<User>)

export default UserModel