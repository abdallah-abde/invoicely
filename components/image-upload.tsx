"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash } from "lucide-react";

import { OurFileRouter } from "@/app/api/uploadthing/core";

import { UploadDropzone } from "@/lib/uploadthing";

import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  defaultUrl?: string;
  onChange?: (url: string | null) => void;
  endpoint: keyof OurFileRouter;
}

export default function ImageUpload({
  defaultUrl,
  onChange,
  endpoint,
}: ImageUploadProps) {
  const [value, setValue] = useState<string | null>(defaultUrl ?? null);
  const [showDropzone, setShowDropzone] = useState<boolean>(!defaultUrl);

  const handleChangeImage = (url: string | null) => {
    setValue(url);
    onChange?.(url);
  };

  if (!showDropzone && value) {
    return (
      <div className="relative">
        <div className="relative w-[100px] h-[100px] shadow-lg overflow-hidden rounded-full">
          <Image src={value} className="object-cover" fill alt={"user image"} />
        </div>
        <div className="mt-3 flex gap-2">
          <Trash className="absolute rounded-full left-1/2 top-1/2 opacity-60 hover:opacity-100 shadow-2xl cursor-pointer bg-primary p-2 size-8 -translate-y-1/2 -translate-x-1/2 transition duration-300 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <UploadDropzone
        endpoint={endpoint}
        content={{
          label: value
            ? "Drop or click to replace the image"
            : "Drop or click to upload an image",
        }}
        appearance={{
          container: "rounded-xl border dark:border-muted",
          label: "transition duration-300 text-primary hover:text-primary/70",
          button:
            "data-[state=disabled]:bg-primary data-[state=ready]:bg-primary/80 data-[state=readying]:bg-primary data-[state=uploading]:bg-primary",
        }}
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.url;

          if (url) {
            setShowDropzone(false);
            handleChangeImage(url);
          }
        }}
      />
    </div>
  );
}
