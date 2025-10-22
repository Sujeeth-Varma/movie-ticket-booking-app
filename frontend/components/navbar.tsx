"use client";
/* eslint-disable @next/next/no-img-element */
import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

import { Accordion } from "@/components/ui/accordion";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/features/user/userSlice";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./theme-toggle";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: "/logo.svg",
    alt: "logo",
    title: "Ticket Buddy",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Movies",
      url: "./movies",
    },
    {
      title: "Resources",
      url: "#",
    },
    {
      title: "Pricing",
      url: "#",
    },
    {
      title: "Blog",
      url: "#",
    },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/signup" },
  },
}: Navbar1Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <section className="py-4 px-2 z-20">
      <div className="fixed left-1/2 -translate-x-1/2 w-full max-w-7xl container bg-muted shadow-[0_3px_10px_rgb(0,0,0,0.2)] px-4 py-0.5 rounded-lg z-50 pointer-events-auto">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex h-12 items-center">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center">
              <div className="flex gap-3 h-full">
                {menu.map((item) => renderMenuItem(item))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <ModeToggle />
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-foreground/90"
                >
                  <a href={auth.login.url}>{auth.login.title}</a>
                </Button>
                <Button asChild size="sm">
                  <a href={auth.signup.url}>{auth.signup.title}</a>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
            </a>

            <div className="flex gap-4">
              <ModeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <a href={logo.url} className="flex items-center gap-2">
                        <img
                          src={logo.src}
                          className="max-h-8"
                          alt={logo.alt}
                        />
                      </a>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>

                    <div className="flex flex-col gap-3">
                      {isAuthenticated ? (
                        <Button variant="outline" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      ) : (
                        <>
                          <Button asChild variant="outline">
                            <a href={auth.login.url}>{auth.login.title}</a>
                          </Button>
                          <Button asChild>
                            <a href={auth.signup.url}>{auth.signup.title}</a>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  return (
    <div key={item.title} className="group h-full">
      <a
        href={item.url}
        className="flex h-full group-hover:bg-background hover:text-accent-foreground rounded-md px-4 py-2 items-center text-sm font-medium transition-colors"
      >
        {item.title}
      </a>
    </div>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

export { Navbar };
