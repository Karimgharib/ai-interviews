"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const Upload = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const res = await fetch("/api/parse-resume", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      setIsLoading(false);
      toast.success(
        "Interview generated successfully. You will find it in your interviews"
      );
      router.refresh();
    } else {
      toast.error("Error while generate interview.");
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
        {isLoading ? "Generating..." : "Generate"}
      </Button>
      {/* <Button type="submit" className="btn-primary">
        Generate an Arabic interview
      </Button> */}
    </form>
  );
};

export default Upload;
