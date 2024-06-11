"use client";
import React from "react";

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
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const formSchema = z.object({
    email: z.string().email({
        message: "Must be a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    rememberMe: z.boolean(),
});

const RegisterPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
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
                            name="rememberMe"
                            render={({ field }) => (
                                <FormItem className="flex items-center">
                                    <FormControl>
                                        <Checkbox
                                            className="bg-white"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel
                                        style={{
                                            marginTop: 0,
                                        }}
                                        className="ml-2 mt-0"
                                    >
                                        Remember Me
                                    </FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
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

export default RegisterPage;
