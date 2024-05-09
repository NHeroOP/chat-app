import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import ChatRoomModel from "@/model/ChatRoom.model";
import UserChatRoomModel, { UserChatRoom } from "@/model/UserChatRoom.model";
import { Types } from "mongoose";

/**
 * Handles the POST request to create a new chatroom.
 * @param req - The request object.
 * @returns A response object indicating the success or failure of the operation.
 */

// data: {
//   roomName: string : optional;
//   description: string: optioanl;
//   createdBy: id;
//   users: Array[];
// }


export async function POST(req:Request) {
  await connectDB()

  try {
    const data = await req.json()
    const session = await auth()

    if(!session || !session.user){
      return Response.json({
        success: false,
        message: "Not authenticated"
      }, { status: 401 })
    }

    if (data?.createdBy !== session.user._id){
      return Response.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 })
    }
    const userId = new Types.ObjectId(session?.user?._id)

    if (data?.users.length < 1) {
      return Response.json({
        success: false,
        message: "There are no users in the chatroom"
      }, { status: 400 })
    }

    const newChatRoom = new ChatRoomModel({
      roomName: data?.roomName || "",
      description: data?.description || "",
      createdBy: userId,
      createdAt: new Date(),
    })

    const newUserChatRooms = data?.users.map((user: string) => (
      new UserChatRoomModel({
        user: new Types.ObjectId(user),
        room: newChatRoom._id
      })
    ))
    await newChatRoom.save()

    await Promise.all(newUserChatRooms.map((newUserChatRoom: UserChatRoom) => newUserChatRoom.save()));
    console.log("Chatroom created");
    
    
    return Response.json({
      success: true,
      message: "chatroom created successfully"
    }, {status: 200})
  } 
  catch (err) {
    console.error("Error while creating chatroom, please try again", err);
    return Response.json({
      success: false,
      message: "Error while creating chatroom, please try again"
    }, {status: 500})
  }
}