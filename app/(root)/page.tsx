"use client";

import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRef } from "react";

const page = async () => {
  const user = await getCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // make that two requsts happen in same time
  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);
  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://ai-interviews-livid.vercel.app/api/parse-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to process");

      const result = await response.json();
      console.log("Success:", result);
      alert("Interview questions generated!");
    } catch (error) {
      console.error("Error:", error);
      alert("Processing failed");
    }
  };

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Make an interview</Link>
          </Button>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
              ref={fileInputRef}
              type="file"
              name="file"
              accept="application/pdf"
            />
            <button type="submit">Extract Role & Skills</button>
          </form>
        </div>
        <Image
          src="/robot.png"
          alt="robot"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>You haven&apos;t generate any interview yet</p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Suggested Interviews</h2>
        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>There are no suggested interviews available</p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
