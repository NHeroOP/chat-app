import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User.model";
 
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";


const UsernameQuerySchema = z.object({
  username: usernameValidation
})

export async function GET(req:Request) {
  await connectDB()
  
  try {
    const { searchParams } = new URL(req.url) 
    const queryParam = {
      username: (searchParams.get("username"))
    }     

    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam)
    console.log(result);
    

    if (!result.success){
      const usernameErrors = result.error.format().username?._errors || []
      console.log(usernameErrors);
      

      return Response.json({
        success: false,
        message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid query params",
      }, {status: 400})
    }

    const { username } = result.data

    const existingUser = await UserModel.findOne({username, isVerified: true})

    if (existingUser) {
      return Response.json({
        success: false,
        message: "Username is already taken"
      }, {status: 400})
    }

    return Response.json({
      success: true,
      message: "Username is unique"
    }, {status: 200})
  } 
  catch (err) {
    console.error("Error checking username", err);
    return Response.json({
      success: false,
      message: "Error checking username",
    }, {status: 500})
  }
}