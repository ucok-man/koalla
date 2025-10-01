"use client";

import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { Image, Loader2, MousePointerSquareDashed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Dropzone, { FileRejection } from "react-dropzone";
import { toast } from "sonner";

export default function UploadPage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
      startTransition(() => {
        router.push(`/configure/design?configId=${data.serverData.config.id}`);
      });
    },
    onUploadProgress: setUploadProgress,
  });

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    setIsDragOver(false);
    toast.error(`${rejectedFiles[0].file.type} type is not supported`, {
      description: "Please choose a PNG, JPG, or JPEG image instead.",
    });
  };

  const onDropAccepted = (acceptedFiles: File[]) => {
    startUpload(acceptedFiles);
    setIsDragOver(false);
  };

  const getIcon = () => {
    if (isDragOver)
      return (
        <MousePointerSquareDashed className="h-6 w-6 text-brand-primary-500 mb-2" />
      );
    if (isUploading || isPending)
      return (
        <Loader2 className="animate-spin h-6 w-6 text-brand-primary-500 mb-2" />
      );
    return <Image className="h-6 w-6 text-brand-primary-500 mb-2" />;
  };

  const getMessage = () => {
    if (isUploading)
      return (
        <div className="flex flex-col items-center">
          <p>Uploading...</p>
          <Progress
            value={uploadProgress}
            className="mt-2 w-40 h-2 bg-brand-desert-300"
          />
        </div>
      );
    if (isPending) return <p>Redirecting, please wait...</p>;
    if (isDragOver)
      return (
        <p>
          <span className="font-semibold">Drop file</span> to upload
        </p>
      );
    return (
      <p>
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
    );
  };

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-24rem)] w-full relative my-16 p-2 rounded-2xl ring-1 ring-inset",
        "bg-brand-desert-900/5 ring-brand-desert-900/10",
        "flex justify-center flex-col items-center",
        isDragOver && "ring-brand-desert-900/25 bg-brand-desert-900/10"
      )}
    >
      <Dropzone
        onDropRejected={onDropRejected}
        onDropAccepted={onDropAccepted}
        accept={{
          "image/png": [".png"],
          "image/jpeg": [".jpeg"],
          "image/jpg": [".jpg"],
        }}
        onDragEnter={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(false)}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            className="h-full w-full flex-1 flex flex-col items-center justify-center"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {getIcon()}
            <div className="flex flex-col justify-center mb-2 text-sm text-primary">
              {getMessage()}
            </div>
            {!isPending && (
              <p className="text-xs text-brand-primary-500">PNG, JPG, JPEG</p>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  );
}
