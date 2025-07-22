import React from "react";
import { signIn } from "next-auth/react";

const page = () => {
  return (
    <>
      <div>
        <h1>One Last Step!</h1>
        <p>To continue, please connect your Instagram account.</p>
        <button
          onClick={() => signIn("instagram", { callbackUrl: "/dashboard" })}
        >
          Connect with Instagram
        </button>
      </div>
    </>
  );
};

export default page;
