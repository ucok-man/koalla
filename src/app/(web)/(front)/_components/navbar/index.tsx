"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function NavbarContent() {
  const { isLoaded, user } = useUser();
  const clerk = useClerk();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const email = user?.emailAddresses.at(0)?.emailAddress;
  const isAdmin = email === process.env.ADMIN_EMAIL;

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => setMobileMenuOpen(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        mobileMenuOpen &&
        !target.closest(".mobile-menu-container") &&
        !target.closest(".mobile-menu-button")
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Skeleton state while Clerk is loading user
  if (!isLoaded) {
    return (
      <nav className="absolute -bottom-12 h-12 -translate-y-1/2 w-full max-w-4xl bg-brand-desert-50 rounded-full flex items-center justify-between px-4 lg:px-6 backdrop-blur-sm shadow-[0px_0px_0px_2px_white]">
        <div className="flex flex-col justify-center text-xl font-medium tracking-wide font-mono">
          <div className="h-5 w-20 bg-brand-primary-50 animate-pulse rounded" />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-6 w-12 bg-brand-primary-50 animate-pulse rounded" />
          <div className="h-6 w-12 bg-brand-primary-50 animate-pulse rounded" />
          <div className="h-8 w-28 bg-brand-primary-50 animate-pulse rounded-full" />
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="absolute -bottom-12 h-12 -translate-y-1/2 w-full max-w-4xl bg-brand-desert-50 rounded-full flex items-center justify-between px-4 lg:px-6 backdrop-blur-sm shadow-[0px_0px_0px_2px_white]">
        <Link href={"/"} className="flex items-center justify-start gap-2">
          <Image
            src={"/brand-logo-primary.png"}
            alt="Logo"
            width={24}
            height={24}
            className=""
          />
          <div className="flex flex-col justify-center text-xl font-medium tracking-wide font-mono">
            Koalla
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="items-center justify-center hidden md:flex">
          <SignedIn>
            <Button
              onClick={() => clerk.signOut()}
              size={"sm"}
              variant={"link"}
            >
              Sign Out
            </Button>

            <div className="w-[1.5px] h-6 bg-border mx-1" />

            {isAdmin && (
              <Link href={"/dashboard"} passHref className="mr-1">
                <Button size={"sm"} variant={"link"}>
                  Dashboard ✨
                </Button>
              </Link>
            )}
          </SignedIn>

          <SignedOut>
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
          </SignedOut>

          <Link href={"/configure/upload"} passHref>
            <Button size={"sm"} variant={"secondary"} className="rounded-full">
              Create Case <ArrowRight />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-0 left-0 w-full mt-2 md:hidden mobile-menu-container z-50">
          <div className="bg-brand-desert-50 rounded-2xl shadow-lg border-2 border-white mx-4 p-4 backdrop-blur-sm">
            <div className="flex flex-col gap-2">
              <SignedIn>
                {isAdmin && (
                  <Link href={"/dashboard"} passHref onClick={handleLinkClick}>
                    <Button
                      size={"sm"}
                      variant={"ghost"}
                      className="w-full justify-start"
                    >
                      Dashboard ✨
                    </Button>
                  </Link>
                )}

                <Link
                  href={"/configure/upload"}
                  passHref
                  onClick={handleLinkClick}
                >
                  <Button
                    size={"sm"}
                    variant={"secondary"}
                    className="w-full rounded-full"
                  >
                    Create Case <ArrowRight className="ml-auto" />
                  </Button>
                </Link>

                <div className="h-[1px] bg-border my-1" />

                <Button
                  onClick={() => {
                    clerk.signOut();
                    handleLinkClick();
                  }}
                  size={"sm"}
                  variant={"ghost"}
                  className="w-full justify-start"
                >
                  Sign Out
                </Button>
              </SignedIn>

              <SignedOut>
                <Link
                  href={"/configure/upload"}
                  passHref
                  onClick={handleLinkClick}
                >
                  <Button
                    size={"sm"}
                    variant={"secondary"}
                    className="w-full rounded-full"
                  >
                    Create Case <ArrowRight className="ml-auto" />
                  </Button>
                </Link>

                <div className="h-[1px] bg-border my-1" />

                <Link href={"/sign-in"} passHref onClick={handleLinkClick}>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="w-full justify-start"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href={"/sign-up"} passHref onClick={handleLinkClick}>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="w-full justify-start"
                  >
                    Sign Up
                  </Button>
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </>
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
