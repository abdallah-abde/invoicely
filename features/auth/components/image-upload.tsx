"use client";

import { useState } from "react";

import Image from "next/image";

import { Trash } from "lucide-react";

import { OurFileRouter } from "@/app/api/uploadthing/core";

import { UploadDropzone } from "@/lib/uploadthing";
import { deleteUserProfileImage } from "../actions/image.actions";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

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

  const t = useTranslations();

  const handleChangeImage = (url: string | null) => {
    setValue(url);
    onChange?.(url);
  };

  if (!showDropzone && value) {
    return (
      <div className="relative flex flex-col items-center justify-center gap-3">
        <div className="relative w-[150px] h-[150px] shadow-lg overflow-hidden rounded-full">
          <Image
            src={value}
            className="object-cover"
            fill
            sizes="150x150"
            alt="user image"
            loading="eager"
          />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-lg"
              className="cursor-pointer"
              onClick={() => {
                handleChangeImage("");
                deleteUserProfileImage(value);
              }}
            >
              <Trash className="text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            {t("update-profile.update-image.delete")}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="relative">
      <UploadDropzone
        endpoint={endpoint}
        content={{
          label: value
            ? t("update-profile.update-image.drop-replace")
            : t("update-profile.update-image.drop-upload"),
        }}
        appearance={{
          container: "rounded-xl border dark:border-muted",
          label: "transition duration-300 text-primary hover:text-primary/70",
          button:
            "data-[state=disabled]:bg-primary data-[state=ready]:bg-primary/80 data-[state=readying]:bg-primary data-[state=uploading]:bg-primary",
        }}
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.ufsUrl;

          if (url) {
            setShowDropzone(false);
            handleChangeImage(url);
          }
        }}
      />
    </div>
  );
}
