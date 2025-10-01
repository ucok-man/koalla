"use client";

import { cn } from "@/lib/utils";
import { Check, Eye, Palette, Upload } from "lucide-react";
import { usePathname } from "next/navigation";
import { useIsClient } from "usehooks-ts";

const STEPS = [
  {
    name: "Upload",
    description: "Upload your photo",
    url: "/upload",
    icon: Upload,
  },
  {
    name: "Customize",
    description: "Design your case",
    url: "/design",
    icon: Palette,
  },
  {
    name: "Review",
    description: "Finalize your order",
    url: "/preview",
    icon: Eye,
  },
];

export default function Steps() {
  const isClient = useIsClient();
  const pathname = usePathname();

  const getStepStatus = (index: number) => {
    const isCurrent = pathname.endsWith(STEPS[index].url);
    const isCompleted = STEPS.slice(index + 1).some((step) =>
      pathname.endsWith(step.url)
    );
    return { isCurrent, isCompleted };
  };

  if (!isClient) return null;

  return (
    <div className="w-full">
      <div className="mx-auto max-w-4xl">
        <ol className="flex items-center">
          {STEPS.map((step, i) => {
            const { isCurrent, isCompleted } = getStepStatus(i);
            const Icon = step.icon;
            const isLast = i === STEPS.length - 1;
            const isFirst = i === 0;

            return (
              <li key={step.name} className="flex flex-1 items-center relative">
                <div className="flex flex-col items-center flex-1">
                  {/* Step circle */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={cn(
                        "flex size-12 items-center justify-center rounded-full border-4 transition-all duration-300 shadow-lg border-brand-primary-200 bg-background",
                        isCurrent && "border-secondary bg-brand-desert-100",
                        isCompleted && "border-brand-desert-300 bg-secondary"
                      )}
                    >
                      {isCompleted ? (
                        <Check
                          className="size-6 text-brand-primary-600"
                          strokeWidth={3}
                        />
                      ) : (
                        <Icon
                          className={cn(
                            "size-6 transition-colors",
                            isCurrent
                              ? "text-brand-primary-800"
                              : "text-brand-primary-400"
                          )}
                        />
                      )}
                    </div>

                    {/* Step text */}
                    <div className="mt-4 flex flex-col items-center text-center">
                      <span
                        className={cn(
                          "text-sm font-semibold transition-colors",
                          isCompleted && "text-brand-primary-700",
                          isCurrent && "text-primary",
                          !isCompleted && !isCurrent && "text-brand-primary-500"
                        )}
                      >
                        {step.name}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1 hidden sm:block">
                        {step.description}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connector line */}
                {!isFirst && (
                  <div
                    className={cn(
                      "absolute h-1 top-[55%] translate-y-1/2 -left-12 w-24 -mt-6 bg-brand-primary-200",
                      isCurrent && "bg-brand-desert-300"
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
