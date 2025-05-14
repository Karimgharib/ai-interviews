"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";

const Upload = () => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const res = await fetch("/api/parse-resume", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Interview generated successfully.");
      window.location.reload();
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
      <Button type="submit" className="btn-primary">
        Generate
      </Button>
    </form>
  );
};

export default Upload;
