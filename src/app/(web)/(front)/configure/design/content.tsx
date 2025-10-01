"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BASE_PRICE,
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/lib/products";
import { useUploadThing } from "@/lib/uploadthing";
import { cn, formatPrice } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { RadioGroup } from "@headlessui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, ChevronsUpDown, Loader } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { Rnd } from "react-rnd";
import { toast } from "sonner";

type Props = {
  configId: string;
};

export default function Content({ configId }: Props) {
  const router = useRouter();
  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { startUpload } = useUploadThing("imageUploader");
  const [isPending, setIsPending] = useState(false);
  const [isRedirecting, startTransition] = useTransition();

  const trpc = useTRPC();

  const config = useQuery(
    trpc.configuration.findById.queryOptions({ cid: configId })
  );

  const [options, setOptions] = useState({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  const initialDimension = useMemo(() => {
    if (!config.data) return { width: 0, height: 0 };

    let width = config.data.width;
    let height = config.data.height;
    let divider = 4;

    while (width > 320) {
      width = config.data.width / divider;
      height = config.data.height / divider;
      divider = divider * 2;
    }
    return { width, height };
  }, [config.data]);

  const [renderedDimension, setRenderedDimension] = useState(initialDimension);

  const [renderedPosition, setRenderedPosition] = useState({
    x: 150,
    y: 205,
  });

  const totalPrice = BASE_PRICE + options.finish.price + options.material.price;

  const updateConfig = useMutation(trpc.configuration.update.mutationOptions());

  const handleContinue = async () => {
    setIsPending(true);
    try {
      if (!phoneCaseRef.current || !containerRef.current || !config.data) {
        toast.error("Missing references or config data");
        return;
      }

      // 1. Get bounding rects for phone and container
      const phone = phoneCaseRef.current.getBoundingClientRect();
      const container = containerRef.current.getBoundingClientRect();

      // 2. Calculate actual crop position (relative to phone area)
      let actualX = renderedPosition.x - (phone.left - container.left);
      let actualY = renderedPosition.y - (phone.top - container.top);

      const thicknessPx = 30; // 8mm border in pixels

      // 3. Create canvas sized to phone + thickness on all sides
      const canvas = document.createElement("canvas");
      canvas.width = phone.width + thicknessPx * 2;
      canvas.height = phone.height + thicknessPx * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to get canvas context");

      // 4. Load user image safely
      const userImage = await new Promise<HTMLImageElement>(
        (resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous"; // needed for external URLs
          img.src = config.data!.imageUrl;
          img.onload = () => resolve(img);
          img.onerror = (err) => reject(new Error("Image failed to load"));
        }
      );

      // 5. Draw the image onto canvas
      ctx.drawImage(
        userImage,
        actualX + thicknessPx, // where to start x, accomadate thickness
        actualY + thicknessPx, // where to start y, accomadate thickness
        renderedDimension.width, // how wide
        renderedDimension.height // how tall
      );

      // 6. Export canvas as Blob → File
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) throw new Error("Failed to create image blob");

      const file = new File([blob], `${configId || Date.now()}-case.png`, {
        type: "image/png",
      });

      // 7. Run upload + metadata update
      await Promise.all([
        startUpload([file], { configId } as any), // -> this will alsow update croppedImage field on config
        updateConfig.mutateAsync({
          configId,
          color: options.color.value,
          finish: options.finish.value,
          material: options.material.value,
          model: options.model.value,
        }),
      ]);

      startTransition(() => {
        router.push(`/configure/preview?id=${configId}`);
      });
    } catch (error) {
      console.error("handleContinue error:", error);
      toast.error("Oops! Something went wrong 🙏");
    } finally {
      setIsPending(false);
    }
  };

  if (config.isPending) {
    return <div>Loading...</div>;
  }

  if (config.error) {
    if (config.error.data?.code === "NOT_FOUND") {
      router.push("/configure/upload");
    } else {
      toast.error("Oops! something went wrong 🙏");
    }

    return <div>Loading...</div>;
  }

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-3 sm:px-12">
      <div
        ref={containerRef}
        className="relative bg-secondary p-16 min-h-[620px]
        h-full max-h-[calc(100vh-20rem)] w-full lg:max-w-4xl overflow-hidden 
        col-span-2 flex items-center justify-center 
        rounded-t-2xl lg:rounded-l-2xl lg:rounded-r-none 
        border-2 border-dashed border-brand-desert-300 aspect-[896/1831]"
      >
        <div className="relative w-60 bg-opacity-50 pointer-events-none min-w-60">
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none relative z-30 aspect-[896/1831] w-full"
          >
            <NextImage
              fill
              alt="phone image"
              src="/phone-template.png"
              className="pointer-events-none z-30 select-none"
            />
          </AspectRatio>

          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px] shadow-white/70" />

          <div
            className={cn(
              "absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]",
              `bg-${options.color.tw}`
            )}
          />
        </div>

        <Rnd
          default={{
            x: 150,
            y: 205,
            height: initialDimension.height,
            width: initialDimension.width,
          }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimension({
              height: parseInt(ref.style.height.slice(0, -2)),
              width: parseInt(ref.style.width.slice(0, -2)),
            });
            setRenderedPosition({ x, y });
          }}
          onDragStop={(_, data) =>
            setRenderedPosition({ x: data.x, y: data.y })
          }
          className="absolute z-20 border-[3px] border-primary"
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: (
              <div className="w-5 h-5 rounded-full shadow border bg-white border-zinc-200 transition hover:bg-primary" />
            ),
            bottomLeft: (
              <div className="w-5 h-5 rounded-full shadow border bg-white border-zinc-200 transition hover:bg-primary" />
            ),
            topRight: (
              <div className="w-5 h-5 rounded-full shadow border bg-white border-zinc-200 transition hover:bg-primary" />
            ),
            topLeft: (
              <div className="w-5 h-5 rounded-full shadow border bg-white border-zinc-200 transition hover:bg-primary" />
            ),
          }}
        >
          <div className="relative w-full h-full">
            <NextImage
              src={config.data.imageUrl}
              fill
              alt="your image"
              className="pointer-events-none"
            />
          </div>
        </Rnd>
      </div>

      <div className="h-full max-h-[calc(100vh-20rem)] min-h-[620px] w-full col-span-full lg:col-span-1 flex flex-col bg-secondary rounded-b-2xl lg:rounded-r-2xl lg:rounded-l-none">
        {/* Header */}
        <div className="px-8 pt-8 pb-0">
          <h2 className="tracking-tight font-bold text-3xl">
            Customize your case
          </h2>

          <div className="w-full h-px bg-border mt-6" />
        </div>

        <ScrollArea className="relative flex-1 overflow-auto">
          {/* Gradient */}
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 top-0 h-12 bg-gradient-to-b from-white pointer-events-none"
          />

          <div className="relative p-8 flex flex-col gap-6">
            {/* Colors Picker */}
            <RadioGroup
              value={options.color}
              onChange={(val) =>
                setOptions((prev) => ({ ...prev, color: val }))
              }
            >
              <Label>Color: {options.color.label}</Label>
              <div className="mt-3 flex items-center space-x-3">
                {COLORS.map((color) => (
                  <RadioGroup.Option
                    key={color.label}
                    value={color}
                    className={({ active, checked }) =>
                      cn(
                        "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent",
                        { [`border-${color.tw}`]: active || checked }
                      )
                    }
                  >
                    <span
                      className={cn(
                        `bg-${color.tw}`,
                        "h-8 w-8 rounded-full border border-black border-opacity-10"
                      )}
                    />
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>

            {/* Model Picker */}
            <div className="relative flex flex-col gap-3 w-full">
              <Label>Model</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {options.model.label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {MODELS.options.map((model) => (
                    <DropdownMenuItem
                      key={model.label}
                      className={cn(
                        "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                        {
                          "bg-zinc-100": model.label === options.model.label,
                        }
                      )}
                      onClick={() =>
                        setOptions((prev) => ({ ...prev, model } as any))
                      }
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          model.label === options.model.label
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {model.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Materials and Finishes */}
            {[MATERIALS, FINISHES].map(
              ({ name, options: selectableOptions }) => (
                <RadioGroup
                  key={name}
                  value={options[name]}
                  onChange={(val) =>
                    setOptions((prev) => ({ ...prev, [name]: val }))
                  }
                >
                  <Label>
                    {name.slice(0, 1).toUpperCase() + name.slice(1)}
                  </Label>
                  <div className="mt-3 space-y-4">
                    {selectableOptions.map((option) => (
                      <RadioGroup.Option
                        key={option.value}
                        value={option}
                        className={({ active, checked }) =>
                          cn(
                            "relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between",
                            { "border-primary": active || checked }
                          )
                        }
                      >
                        <span className="flex items-center">
                          <span className="flex flex-col text-sm">
                            <RadioGroup.Label
                              className="font-medium text-gray-900"
                              as="span"
                            >
                              {option.label}
                            </RadioGroup.Label>
                            {option.description && (
                              <RadioGroup.Description
                                as="span"
                                className="text-gray-500"
                              >
                                <span className="block sm:inline">
                                  {option.description}
                                </span>
                              </RadioGroup.Description>
                            )}
                          </span>
                        </span>
                        <RadioGroup.Description
                          as="span"
                          className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                        >
                          <span className="font-medium text-gray-900">
                            {formatPrice(option.price / 100)}
                          </span>
                        </RadioGroup.Description>
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              )
            )}
          </div>
        </ScrollArea>

        {/* Submit Button */}
        <div className="px-8 pt-0 pb-8">
          <div className="h-px w-full bg-border mb-6" />

          <div className="w-full flex flex-col gap-3 items-center">
            <p className="font-medium whitespace-nowrap self-start">
              {formatPrice(totalPrice / 100)}
            </p>
            <Button
              disabled={isPending || isRedirecting}
              onClick={async () => handleContinue()}
              size="sm"
              className="w-full"
            >
              {isPending ? (
                <>
                  Processing...
                  <Loader className="size-4 inline animate-spin" />
                </>
              ) : isRedirecting ? (
                <>
                  Redirecting...
                  <Loader className="size-4 inline animate-spin" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-1.5 inline" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
