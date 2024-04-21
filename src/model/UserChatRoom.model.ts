import { Document, Schema, model, models, Model, Types } from "mongoose";

export interface UserChatRoom extends Document {
  user: Types.ObjectId,
  room: Types.ObjectId,
}

const UserChatRoomSchema: Schema<UserChatRoom> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"]
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: [true, "Room is required"]
  },
})
const UserChatRoomModel = (models.UserChatRoom as Model<UserChatRoom>) || (model("UserChatRoom", UserChatRoomSchema)<UserChatRoom>)

export default UserChatRoomModel