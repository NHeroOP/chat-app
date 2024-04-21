import connectDB from "@/lib/connectDB";

export async function POST(req:Request) {
  await connectDB()
  
  const { userId } = await req.json()

}