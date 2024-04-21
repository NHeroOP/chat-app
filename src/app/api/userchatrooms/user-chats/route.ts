import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import ChatRoomModel from "@/model/ChatRoom.model";
import UserModel from "@/model/User.model";
import UserChatRoomModel from "@/model/UserChatRoom.model";


export async function POST(req:Request) {
  await connectDB();
  const { userId } = await req.json()
  const session = await auth()


  if(!session || !session.user){
    return Response.json({
      success: false,
      message: "Not authenticated"
    }, { status: 401 })
  }

  if (session?.user._id !== userId.toString()){
    return Response.json({
      success: false,
      message: "Unauthorized"
    }, { status: 401 })
  }

  try {
    
    const userChatRooms = await UserChatRoomModel.find({ user: userId });

    const chatRooms = await Promise.all(userChatRooms.map(async (userChatRoom) => {
      const chatRoom = await ChatRoomModel.findById(userChatRoom.room);
      return chatRoom;
    }));

    return Response.json({
      success: true,
      userChats: chatRooms,
    }, { status: 200})
    
  } catch (err) {
    return Response.json({
      success: false,
      message: "Internal Server Error"
    }, { status: 500})
  }
}