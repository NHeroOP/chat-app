"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { useDebounceCallback } from "usehooks-ts"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { signupSchema } from "@/schemas/signupSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { Loader2 } from "lucide-react"
import { useTheme } from "next-themes"


export default function SignUp() {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  
  const debounced = useDebounceCallback(setUsername, 300) 
  

  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async(data: z.infer<typeof signupSchema>) => {
    setLoading(true)

    try {
      const res = await axios.post<ApiResponse>("/api/auth/signup", data)


      if (res.data.success) {
        toast({
          title: "Success",
          description: res.data.message,
        })
        router.replace(`/verify/${username}`)
      } else {
        toast({
          title: "Singnup Failed",
          description: res.data.message,
          variant: "destructive",
        })
      }

    } catch (err) {
      console.error("Error in signup", err)
      const axiosError = err as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "Singnup Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
    finally{
      setLoading(false)
    }
  }

  

  useEffect(() => {
    const checkUniqueUsername = async() => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage("")

        try {
          const res = await axios.get(`/api/users/check-unique-username?username=${username}`)

          console.log(res.data.message)

          setUsernameMessage(res?.data?.message)
        } 
        catch (err) {
          const axiosError = err as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username."
          )
        }
        finally{
          setIsCheckingUsername(false)
        }
      }
    }

    checkUniqueUsername()
  }, [username])


  return (
    <section className="flex justify-center items-center h-screen bg-[#f1f1f1] dark:bg-[#212121]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center">
          
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        type="text"
                        placeholder="nhero" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e)
                          debounced(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      {isCheckingUsername && <Loader2 className="animate-spin" />}
                      <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}> {usernameMessage}</p>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="nhero@nhero.tech" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="*****" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="mt-2">
                {loading ? 
                <>
                  Signing Up
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </> : "Signup"}
              </Button>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Sign in
                </Link>
              </div>
                    
            </CardContent>
          </Card>
        </form>
      </Form>  
    </section>
  )
}
