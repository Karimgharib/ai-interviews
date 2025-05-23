import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <h3 className="mb-5">Interview Generation</h3>
      <Agent
        photoURL={user?.photoURL}
        userName={user?.name}
        userId={user?.id}
        type="generate"
      />
    </>
  );
};

export default page;
