"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, UploadIcon } from "lucide-react";

const Upload = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      toast.error("Please select a PDF file.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          "Interview generated successfully. You will find it in your interviews"
        );
        router.refresh();
      } else {
        toast.error("Error while generating interview.");
      }
    } catch (error) {
      toast.error("Unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="flex flex-col gap-2"
    >
      <Button asChild className="btn-primary w-5/11 max-sm:w-full text-center">
        <input type="file" name="file" accept="application/pdf" />
      </Button>
      <Button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Generating..." : "Generate an interview"}
      </Button>
      {/* <Button type="submit" className="btn-primary">
        Generate an Arabic interview
      </Button> */}
    </form>
  );
};

export default Upload;
