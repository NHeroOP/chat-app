import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import ChatRoomModel from "@/model/ChatRoom.model";
import UserChatRoomModel from "@/model/UserChatRoom.model";
import { Types } from "mongoose";

export async function POST(req: Request) {
  await connectDB()

  const session = await auth()
  const user = session?.user

  if (!user) {
    return Response.json({
      success: false,
      message: "You need to be logged in to create a chatroom"
    }, {status: 401})
  }

  const {roomId} = await req.json()
  const chatroom = await ChatRoomModel.findById(roomId)

  if(!chatroom){
    return Response.json({
      success: false,
      message: "Chatroom not found"
    }, {status: 404})
  }

  const newUserChatRoom = new UserChatRoomModel({room: new Types.ObjectId(roomId), user: new Types.ObjectId(user._id)})
  await newUserChatRoom.save()

  return Response.json({
    success: true,
    message: "User joined chatroom"    
  }, {status: 200})
}