"use client";
import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import jwt from "jsonwebtoken";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
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
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { userAtom } from "@/state-machine/atoms";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Must be a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  rememberMe: z.boolean(),
});

const LoginPage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    // Load saved credentials from local storage
    const savedCredentials = localStorage.getItem("rememberedCredentials");
    if (savedCredentials) {
      const { email, password } = JSON.parse(savedCredentials);
      form.setValue("email", email);
      form.setValue("password", password);
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`,
        values
      );
      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.accessToken);
        const data = jwt.decode(res.data.accessToken);
        if (!data || typeof data === "string") throw new Error("Invalid token");
        const user = data.payload;
        setUser(user);
        if (values.rememberMe) {
          // Save credentials in local storage if "Remember Me" is checked
          localStorage.setItem(
            "rememberedCredentials",
            JSON.stringify({
              email: values.email,
              password: values.password,
            })
          );
        } else {
          // Clear saved credentials from local storage if "Remember Me" is not checked
          localStorage.removeItem("rememberedCredentials");
        }
        router.push("/");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mt-6">
        <h1 className=" text-4xl font-bold text-center">Login</h1>
        <p className="text-center my-4">
          To get started, you need to signup here.
        </p>
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 min-w-96 bg-white p-5 rounded-md border shadow-sm"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    className="bg-white"
                    placeholder="abcd@efg.com"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    className="bg-white"
                    placeholder="Password..."
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <Checkbox
                    className="bg-white"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FormLabel className="ml-2">Remember Me</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
      <div className="mt-3 flex gap-2 ">
        <span>Don&apos;t have an account?</span>
        <span>
          <Link className="text-primary" href="/register">
            Create one
          </Link>
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
