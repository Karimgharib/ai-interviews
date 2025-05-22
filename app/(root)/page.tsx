import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import Image from "next/image";
import Link from "next/link";
import Upload from "@/components/Upload";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const page = async () => {
  const user = await getCurrentUser();

  // make that two requsts happen in same time
  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);
  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>
          <div className="flex flex-col gap-4 max-w-lg">
            <p className="text-sm">Generate interview by call with ai</p>
            <Button asChild className="btn-primary max-sm:w-full">
              <Link href="/interview">Generate an interview</Link>
            </Button>
            {/* <Button asChild className="btn-primary">
              <Link href="/interview">Generate an Arabic interview</Link>
            </Button> */}
            <p className="text-sm">Generate interview by upload cv</p>
            <Upload />
          </div>
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
        {hasPastInterviews ? (
          <Carousel>
            <CarouselContent>
              {userInterviews?.map((interview) => (
                <CarouselItem
                  key={interview.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <InterviewCard {...interview} interviewId={interview.id} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="max-sm:-left-3 cursor-pointer" />
            <CarouselNext className="max-sm:-right-3 cursor-pointer" />
          </Carousel>
        ) : (
          <div className="p-4">
            <p>You haven&apos;t generated any interviews yet.</p>
          </div>
        )}
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Suggested Interviews</h2>

        {hasUpcomingInterviews ? (
          <Carousel>
            <CarouselContent>
              {latestInterviews?.map((interview) => (
                <CarouselItem
                  key={interview.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <InterviewCard {...interview} interviewId={interview.id} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="max-sm:-left-3 cursor-pointer " />
            <CarouselNext className="max-sm:-right-3 cursor-pointer" />
          </Carousel>
        ) : (
          <div className="p-4">
            <p>There are no suggested interviews available.</p>
          </div>
        )}
      </section>
    </>
  );
};

export default page;
