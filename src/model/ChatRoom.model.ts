import { Document, Schema, model, models, Model, Types } from "mongoose";

export interface ChatRoom extends Document {
  roomName: string,
  description: string,
  createdBy: Types.ObjectId,
  createdAt: Date,
}

const ChatRoomSchema: Schema<ChatRoom> = new Schema({
  roomName: {
    type: String,
  },
  description: {
    type: String
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
})
const ChatRoomModel = (models.ChatRoom as Model<ChatRoom>) || (model("ChatRoom", ChatRoomSchema)<ChatRoom>)

export default ChatRoomModel