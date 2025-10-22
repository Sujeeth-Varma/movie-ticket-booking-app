/* eslint-disable @next/next/no-img-element */
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <section className="relative overflow-hidden min-h-screen pt-20  lg:pt-56">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <img
          alt="background"
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
          className="opacity-90 [mask-image:radial-gradient(75%_75%_at_center,white,transparent)]"
        />
      </div>
      <div className="container mx-auto relative z-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <div>
              <h1 className="mb-6 text-pretty text-2xl font-bold tracking-tight lg:text-5xl">
                Booking Movie tickets made easy by{" "}
                <span className="text-primary bg-clip-text bg-gradient-to-l from-blue-400 to-pink-500">
                  Ticket Buddy
                </span>
              </h1>
              <p className="text-muted-foreground mx-auto max-w-3xl lg:text-xl">
                Experience the ultimate convenience in booking movie tickets
                with Ticket Buddy. Our user-friendly application allows you to
                browse through a wide selection of movies, choose your preferred
                showtime, and secure your seats in just a few clicks. Say
                goodbye to long queues and hello to hassle-free ticket booking!
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <Button className="shadow-sm transition-shadow hover:shadow">
                <Link href={"/movies"}>Book Tickets</Link>
              </Button>
              <Button variant="outline" className="group">
                <Link href={"/movies"}>Movies</Link>
                <ExternalLink className="ml-2 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
