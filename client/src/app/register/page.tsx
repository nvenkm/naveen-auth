"use client";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import RecaptchaComponent from "@/components/Recaptcha";

const formSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Must be a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

const RegisterPage = () => {
  const router = useRouter();
  const api = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      setIsLoading(true);
      if (!recaptchaToken) {
        toast.error("Please verify that you are not a robot");
        return;
      }
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/register`,
        { ...values, recaptchaToken }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        form.reset();
      }

      if (!res.data.success) {
        toast.error(res.data.message);
      }

      console.log(res.data.success);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex flex-col items-center">
      <div className="mt-2">
        <h1 className=" text-4xl font-bold text-center">Register</h1>
        <p className="text-center my-2">
          To get started, you need to signup here.
        </p>
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 min-w-96 bg-white p-5 rounded-md border shadow-sm"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="Full Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="abcd@efg.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-white"
                      placeholder="Password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      type="password"
                      placeholder="Confirm Password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button type="submit">
              {" "}
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                ""
              )}
              Submit
            </Button>
            <RecaptchaComponent
              onChange={(val: string | null) => {
                if (val) setRecaptchaToken(val);
                console.log(val);
              }}
            />
          </form>
        </Form>
      </div>
      <div className="mt-3 flex gap-2 ">
        <span>Already have an account?</span>
        <span>
          <Link className="text-primary" href="/login">
            Login
          </Link>
        </span>
      </div>
    </div>
  );
};

export default RegisterPage;
