import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User.model";
import UserChatRoomModel from "@/model/UserChatRoom.model";
import { Types } from "mongoose";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { userId, roomId } = await req.json();
    const session = await auth();

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated"
        },
        { status: 401 }
      );
    }

    if (session.user._id !== userId) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized"
        },
        { status: 401 }
      );
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found"
        },
        { status: 404 }
      );
    }

    if (!user.isVerified) {
      return Response.json(
        {
          success: false,
          message: "User not verified"
        },
        { status: 401 }
      );
    }

    // Aggregate pipeline to fetch usernames for a specific chat room
    
    const usernames = await UserChatRoomModel.aggregate([
      { $match: { room: new Types.ObjectId(roomId) } }, // Match documents with the specified roomId
      { $lookup: { // Join with UserModel to fetch user details
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }, // Unwind array created by $lookup to separate each user
      { $project: { username: "$user.username", _id: 0 } } // Project only the username field
    ]);
    console.log(usernames);
    

    return Response.json(
      {
        success: true,
        message: "Usernames fetched successfully",
        data: usernames
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching usernames:", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error"
      },
      { status: 500 }
    );
  }
}
