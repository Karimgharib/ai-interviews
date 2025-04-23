import Agent from "@/components/Agent";
import React from "react";

const page = () => {
  return (
    <>
      <h3 className="mb-5">Interview Generation</h3>
      <Agent userName="You" userId="userId" type="generate" />
    </>
  );
};

export default page;
