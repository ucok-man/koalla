"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function NavbarContent() {
  return (
    <nav className="absolute -bottom-12 h-12 -translate-y-1/2 w-full max-w-4xl bg-brand-desert-50 rounded-full flex items-center justify-between px-4 lg:px-6 backdrop-blur-sm shadow-[0px_0px_0px_2px_white]">
      <Link href={"/"}>
        <div className="flex flex-col justify-center text-xl font-medium tracking-wide font-mono">
          Koalla
        </div>
      </Link>

      <div className="flex items-center justify-center">
        <Link href={"/sign-in"} passHref>
          <Button size={"sm"} variant={"link"}>
            Sign In
          </Button>
        </Link>

        <div className="w-[1.5px] h-6 bg-border mx-1" />

        <Link href={"/sign-up"} passHref className="mr-1">
          <Button size={"sm"} variant={"link"}>
            Sign Up
          </Button>
        </Link>

        <Link href={"/configure"} passHref>
          <Button size={"sm"} variant={"secondary"} className="rounded-full">
            Create Case <ArrowRight />
          </Button>
        </Link>
      </div>
    </nav>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Original Navbar */}
      <div className="w-full h-12 border-b border-border mb-6">
        <div className="relative size-full flex justify-center">
          <NavbarContent />
        </div>
      </div>

      {/* Sticky Navbar */}
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="w-full h-12 backdrop-blur-md">
          <div className="relative size-full flex justify-center">
            <NavbarContent />
          </div>
        </div>
      </div>
    </>
  );
}
