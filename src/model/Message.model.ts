import { Document, Schema, model, models, Model, Types } from "mongoose";

export interface Message extends Document {
  room: Types.ObjectId,
  sender: Types.ObjectId,
  body: string,
  file: string,
  createdAt: Date,
}

const MessageSchema: Schema<Message> = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: "ChatRoom"
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  body: {
    type: String,
    required: [true, "Message is required"]
  },
  file: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
})
const MessageModel = (models.Message as Model<Message>) || (model("Message", MessageSchema)<Message>)

export default MessageModel