"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, storage } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { Input } from "./ui/input";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up" ? z.string().min(4).max(50) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Google Sign-in handler
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();
      await signIn({ email: user.email!, idToken });

      toast.success("Signed in with Google");
      router.push("/");
    } catch (error) {
      toast.error("Google sign-in failed");
      console.error(error);
    }
  };

  // GitHub Sign-in handler
  const handleGithubSignIn = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();
      await signIn({ email: user.email!, idToken });

      toast.success("Signed in with GitHub");
      router.push("/");
    } catch (error) {
      toast.error("GitHub sign-in failed");
      console.error(error);
    }
  };

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        await sendEmailVerification(userCredential.user);
        toast.success("Verification email sent. Please check your inbox.");
        router.push("/sign-in");
      } else {
        const { email, password } = values;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (!userCredential.user.emailVerified) {
          toast.error("Please verify your email before signing in.");
          return;
        }

        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error("Sign in failed");
          return;
        }

        await signIn({ email, idToken });

        toast.success("Sign in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">TechInterviews</h2>
        </div>
        <h3 className="text-center">Practice job interview with AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
            <Button className="btn" type="submit">
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <h6 className="text-center -my-5">Or</h6>

        <div className="max-md:flex-col flex justify gap-4">
          <Button className="btnAuth" onClick={handleGoogleSignIn}>
            Continue with Google
            <Image src="/google.png" alt="google" width={20} height={20} />
          </Button>
          <Button className="btnAuth" onClick={handleGithubSignIn}>
            Continue with GitHub
            <Image src="/github.png" alt="google" width={20} height={20} />
          </Button>
        </div>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "sign in" : "sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
