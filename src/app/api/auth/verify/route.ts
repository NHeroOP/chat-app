import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User.model";

export async function POST(req:Request ) {
  await connectDB()
  try {
    const { username, otp } = await req.json()
    const decodedUsername = decodeURIComponent(username)
    const user = await UserModel.findOne({ username: decodedUsername })

    if (!user) {
      return Response.json({ 
        success: false, 
        message: "User not found" 
      }, { status: 500 })
    }

    if (user.isVerified) {
      return Response.json({ 
        success: false, 
        message: "User is already verified" 
      }, { status: 400 })
    }

    const isTokenValid = user.verifyToken === otp
    const isTokenExpired = new Date(user.verifyTokenExpiry) < new Date()

    if (isTokenValid && !isTokenExpired) {
      user.isVerified = true
      await user.save()

      return Response.json({ 
        success: true, 
        message: "User verified successfully" 
      }, { status: 200 })
    } 
    else if (isTokenExpired) {
      return Response.json({ 
        success: false, 
        message: "Verification code expired, Please Signup Again" 
      }, { status: 400 })
    } 
    else {
      return Response.json({ 
        success: false, 
        message: "Invalid verification code" 
      }, { status: 400 })
    }
  } catch (err) {
    console.error("Error while verifying user", err);
    return Response.json({
      success: false,
      message: "Failed to verify user",
    }, { status: 500})
  }
}