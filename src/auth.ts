import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/connectDB"
import UserModel from "./model/User.model"
import { compare } from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      authorize: async (credentials:any): Promise<any> => {
        await connectDB()
        
        try {
          const user = await UserModel.findOne({email: credentials.email})

          if(!user) {
            throw new Error("User not found with this email")
          }

          if(!user.isVerified){
            throw new Error("Please verify before login")
          }

          const isPassCorrect = await compare(credentials.password, user.password)

          if(!isPassCorrect) {
            throw new Error("Incorrect Password")
          }

          return user
        } 
        catch (err: any) {
          throw new Error(err)
        }
      },
      
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }){
      
      if (user) {
        token._id = user._id
        token.username = user.username
        token.isVerified = user.isVerified
      }

      return token
    },
    async session({ session, token }){
      session.user._id = token._id as string
      session.user.username = token.username as string
      session.user.isVerified = token.isVerified as boolean
      
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET,
})