import { auth } from "@/auth"
import connectDB from "@/lib/connectDB"
import ChatRoomModel from "@/model/ChatRoom.model"

export async function POST(req:Request) {
  await connectDB()

  const session = await auth()
  const {userId} = await req.json()

  if(!session || !session.user){
    return Response.json({
      success: false,
      message: "Not authenticated"
    }, { status: 401 })
  }

  if(session.user._id !== userId){
    return Response.json({
      success: false,
      message: "Unauthorized"
    }, { status: 401 })
  }

  try {
    const chats = await ChatRoomModel.find()
    const chatsData = chats.map((chat) => ({
      _id: chat._id,
      roomName: chat.roomName,
      description: chat.description,
      createdBy: chat.createdBy,
      createdAt: chat.createdAt,
    }))
    return Response.json({
      success: true,
      message: "Chats found",
      data: chatsData
    }, {status: 200})
  } catch (err) {
    return Response.json({
      success: false,
      message: "Chats not found"
    }, {status: 404})
  }
}
