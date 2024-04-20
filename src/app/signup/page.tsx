"use client"

import React, { useState } from "react"
import Link from "next/link"
import axios from "axios"

import { useToast } from "@/components/ui/use-toast"
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
import { ToastAction } from "@/components/ui/toast"


export default function SignUp() {
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  })

  const {toast} = useToast()

  const handleInputChange = (e: any) => {
    let name = e.target.name
    let value = e.target.value

    setCredentials(prev => ({...prev, [name]:value}))

  }

  const handleSubmit = async(e: any) => {
    setLoading(true)
    e.preventDefault()
  
    try {
      const {data} = await axios.post("/api/auth/signup", credentials)
      
      if (data.success) {
        toast({
          title: "Success Message",
          description: data.message,
        })
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.response.data.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
    
    
    setCredentials({email: "", username: "", password: ""})
    setLoading(false)
  }

  return (
    <section className="flex justify-center items-center h-screen bg-[#f1f1f1] dark:bg-[#212121]">
      <form onSubmit={handleSubmit} className={`${loading && "cursor-not-allowed"}`}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Username</Label>
                <Input 
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange} 
                  placeholder="Max" 
                  disabled={loading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  disabled={loading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full flex gap-4">
                Create an account {loading && <span className="loading loading-spinner loading-md" />}
              </Button>
              {/* <Button variant="outline" className="w-full">
                Sign up with GitHub
              </Button> */}
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </form> 
    </section>
  )
}
