"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";

export default function ImageUploadModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      const { data: uploadData } = await axios.post("/api/upload", {
        fileName: file.name,
        fileType: file.type,
      });

      const signedPutUrl = uploadData.url;

      await axios.put(signedPutUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      console.log("✅ File uploaded to S3");

      const { data: getUrlData } = await axios.get("/api/fetch-images", {
        params: { fileName: file.name },
      });

      const downloadUrl = getUrlData.url;

      console.log("✅ Download URL:", downloadUrl);
      alert(`✅ Uploaded! View image:\n${downloadUrl}`);

      onOpenChange(false);
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Upload failed.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={cn(
          "bg-zinc-900 border-none text-white p-6 w-full max-w-md text-center",
          {
            "border-2 border-blue-500": dragOver,
          }
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg mb-4">
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          <div className="text-3xl">📷</div>
          <p className="text-sm text-gray-300">Drag photos and videos here</p>
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>
            Select from computer
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
