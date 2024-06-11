import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
    return (
        <nav className=" bg-slate-50 py-4">
            <div className="mx-24 flex items-center text-xl justify-between">
                <Link href="/">Auth.naveen</Link>
                <ul className="flex gap-5 items-center ml-14">
                    <Button className="bg-white text-black border hover:bg-slate-50">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button>
                        <Link href="/register">Register</Link>
                    </Button>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
