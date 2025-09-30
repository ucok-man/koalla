import Phone from "@/components/phone";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Star } from "lucide-react";
import Link from "next/link";
import ReviewColumn from "./_components/review-column";
import Testimonials from "./_components/testimonials";

const REVIEW_IMAGES = [
  "/reviews/1.jpg",
  "/reviews/2.jpg",
  "/reviews/3.jpg",
  "/reviews/4.jpg",
  "/reviews/5.jpg",
  "/reviews/6.jpg",
];

const FEATURE_HIGHLIGHTS = [
  "High-quality silicone material",
  "Scratch- and fingerprint resistant coating",
  "Wireless charging compatible",
  "5 year print warranty",
];

const TESTIMONIAL_ITEMS = [
  {
    content:
      "The case feels durable and I even got a compliment on the design. Had the case for two and a half months now and the image is super clear, Love it.",
    name: "Jamie Marshall",
    company: "Hoomies at, Exponent",
    image: "/users/user-1.png",
  },
  {
    content:
      "My phone is always in my pocket with my keys, so my old cases got scratched up. This one still looks almost new after six months, except for a tiny scratch on the corner. I love it.",
    name: "Sarah Chen",
    company: "Hoomies at, TechFlow",
    image: "/users/user-2.png",
  },
];

export default function HomePage() {
  return (
    <div className="py-12 relative space-y-12">
      {/* BG Effect */}
      <div className="fixed transform left-1/2 -translate-x-1/2 top-1/6 -translate-y-1/2 pointer-events-none w-full z-0">
        <img
          src="/mask-group-pattern.svg"
          alt=""
          className="w-[936px] sm:w-[1404px] md:w-[2106px] lg:w-[2808px] h-auto opacity-30 sm:opacity-40 md:opacity-40 mix-blend-multiply"
          style={{
            filter: "hue-rotate(15deg) saturate(0.7) brightness(1.2)",
          }}
        />
      </div>

      <section>
        <div className="w-full flex flex-col items-center justify-center gap-6">
          {/* Happy Customers */}
          <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="flex -space-x-4">
              {[
                "/users/user-1.png",
                "/users/user-2.png",
                "/users/user-3.png",
                "/users/user-4.jpg",
                "/users/user-5.jpg",
              ].map((src, i) => (
                <img
                  key={i}
                  className={`inline-block h-10 w-10 rounded-full ring-2 ring-secondary ${
                    i === 4 ? "object-cover" : ""
                  }`}
                  src={src}
                  alt={`user image ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex flex-col justify-between items-center sm:items-start">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-brand-desert-700 fill-brand-desert-600"
                  />
                ))}
              </div>

              <p>
                <span className="font-semibold">1.250</span> happy customers
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="max-w-4xl text-primary font-serif text-[80px] font-normal leading-24 text-center">
            Turn Your Memories Into
            <br />
            Custom Phone Case
          </h1>

          {/* Sub Heading */}
          <p className="text-center max-w-2xl text-brand-primary-600 font-medium text-lg leading-7">
            Koalla protects your memories, not just your phone.
            <br />
            Carry the moments you love everywhere you go.
          </p>

          {/* CTA */}
          <div className="gap-6 flex flex-col items-center justify-center mt-6">
            <Link href={"/configure"} passHref>
              <Button
                size={"xl"}
                className="rounded-full bg-gradient-to-b from-brand-primary-900 to-brand-desert-950 mix-blend-multiply hover:opacity-95"
              >
                Order Now
                <span>
                  <ArrowRight />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="w-full flex flex-col items-center justify-center gap-16">
          <div className="relative mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 h-[49rem] overflow-hidden">
            <ReviewColumn
              imgs={[REVIEW_IMAGES[0], REVIEW_IMAGES[1]]}
              speed={35}
            />
            <ReviewColumn
              imgs={[REVIEW_IMAGES[2], REVIEW_IMAGES[3]]}
              speed={25}
            />
            <ReviewColumn
              imgs={[REVIEW_IMAGES[4], REVIEW_IMAGES[5]]}
              speed={35}
            />

            {/* Fade gradients */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-desert-50" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-desert-50" />
          </div>
        </div>
      </section>

      <section>
        <div className="w-full flex flex-col items-center justify-center gap-16">
          <h2 className="w-full text-center flex justify-center flex-col text-primary text-5xl font-semibold leading-tight tracking-tight">
            What our customers say
          </h2>

          <Testimonials items={TESTIMONIAL_ITEMS} />
        </div>
      </section>

      <section>
        <div className="w-full flex flex-col items-center justify-center gap-16">
          <h2 className="w-full text-center flex justify-center flex-col text-primary text-5xl font-semibold leading-tight tracking-tight">
            Get your own case now ✨
          </h2>
          <div className="space-y-12">
            <div className="relative flex flex-col items-center gap-16 min-[900px]:flex-row min-[900px]:justify-center min-[900px]:gap-6">
              <div className="relative w-full min-h-[580px] min-[900px]:justify-self-end max-w-sm rounded-xl ring-inset ring-ring/10 lg:rounded-2xl">
                <img
                  src="/horse.jpg"
                  className="rounded-md object-cover shadow-2xl ring-1 ring-ring/10 h-full w-full"
                />
              </div>

              <img
                src="/arrow.png"
                className="rotate-90 min-[900px]:rotate-0"
              />

              <Phone className="w-60" img="/horse_phone.jpg" />
            </div>

            <ul className="mx-auto mt-12 max-w-prose sm:text-lg space-y-2 w-fit flex justify-center flex-col items-center">
              {FEATURE_HIGHLIGHTS.map((text, i) => (
                <li key={i} className="w-fit">
                  <Check className="size-5 text-brand-desert-700 inline mr-1.5" />
                  {text}
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center justify-center">
              <Link href={"/configure"} passHref>
                <Button
                  size={"xl"}
                  className="rounded-full bg-gradient-to-b from-brand-primary-900 to-brand-desert-950 mix-blend-multiply hover:opacity-95"
                >
                  Create Case
                  <span>
                    <ArrowRight />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
