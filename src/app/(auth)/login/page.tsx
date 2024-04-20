"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"


export default function Login() {
  
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e: any) => {
    let name = e.target.name
    let value = e.target.value

    setCredentials(prev => ({...prev, [name]:value}))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await signIn("credentials", {redirect: false ,...credentials})
      console.log(res);
      

      if (!res?.error) {
        router.push("/")
        toast({
          title: "Login Success!",
          description: "You have successfully logged in",
        })
      }
      else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Please check your credentials and try again",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
    } catch (err: any) {
      console.log(err);
      
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please check your credentials and try again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }

    setCredentials({ email: "", password: "" })
    setLoading(false)
  }

  return (
    <section className="flex justify-center items-center h-screen bg-[#f1f1f1] dark:bg-[#212121]">
      <form 
        onSubmit={handleSubmit} 
        className={`${loading && "cursor-not-allowed"}`} 
      >
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full flex gap-4">
                Login {loading && <span className="loading loading-spinner loading-md" />}
              </Button>
              {/* <Button variant="outline" className="w-full">
                Login with Google
              </Button> */}
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </section>
  )
}

