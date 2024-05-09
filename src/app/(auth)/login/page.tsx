"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { loginSchema } from "@/schemas/loginSchema"
import { Loader2 } from "lucide-react"


export default function Login() {
  
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async(data: z.infer<typeof loginSchema>) => {
    setLoading(true)

    try {
      const res = await signIn("credentials", {
        redirect: false,
        ...data
      })
      console.log(res);
      

      if (!res?.error) {
        router.replace("/")
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

    setLoading(false)
  }

  return (
    <section className="flex justify-center items-center h-screen bg-[#f1f1f1] dark:bg-[#212121]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-xl">Log In</CardTitle>
              <CardDescription>
                Enter your information to Login
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center">
          
              
              <FormField
                name="identifier"
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
                  Loging In
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </> : "Login"}
              </Button>

              <div className="mt-4 text-center text-sm">
                Dont't have an account?{" "}
                <Link href="/signup" className="underline">
                  Sign up
                </Link>
              </div>
                    
            </CardContent>
          </Card>
        </form>
      </Form>  
    </section>
  )
}

