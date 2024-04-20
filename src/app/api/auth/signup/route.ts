import sendEmail from "@/helpers/send";
import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User.model";
import { hash } from "bcryptjs";

export async function POST(req:Request) {
  await connectDB()

  try {
    const { email, username, password } = await req.json()

    const verifiedUserByUsername = await UserModel.findOne({
      username, isVerified: true
    })

    if (verifiedUserByUsername) {
      return Response.json({
        success: false,
        message: "Username is already taken"
      }, {status: 400})
    }

    const userByEmail = await UserModel.findOne({email})
    const verifyToken = Math.floor(100000 + Math.random() * 900000).toString()

    if (userByEmail){
      if(userByEmail.isVerified){
        return Response.json({
          success: false,
          message: "User already exists with this email"
        }, {status: 400})
      } else {
        const hashedPass = await hash(password, 10)
        userByEmail.username = username
        userByEmail.password = hashedPass
        userByEmail.verifyToken = verifyToken
        userByEmail.verifyTokenExpiry = new Date(Date.now() + 3600000)
        await userByEmail.save()
      }
    } else {
      const hashedPass = await hash(password, 10)
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 1)

      const newUser = new UserModel({
        username, email, password: hashedPass,
        verifyToken, verifyTokenExpiry: expiryDate
      })

      await newUser.save()
    }

    const emailResponse = await sendEmail(email, username, verifyToken)

    if(!emailResponse.success){
      return Response.json({
        success: false,
        message: emailResponse.message
      }, {status: 500})
    }
 
    return Response.json({
      success: true,
      message: "User Registered Successfully, Please verify your email"
    }, {status: 200})
  } 
  catch (err) {
    console.error("Error while registering user", err);
    return Response.json({
      success: false,
      message: "Error while registering user"
    }, {status: 500})
  }
}