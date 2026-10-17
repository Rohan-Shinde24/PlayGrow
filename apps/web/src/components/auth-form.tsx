
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sprout } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Brand } from "@/components/brand";
import { usePlayGrow } from "@/context/playgrow-context";

type AuthFields = {
  companyName?: string;
  email: string;
  password: string;
};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { ready, user, logIn, register: createAccount } = usePlayGrow();
  const isRegister = mode === "register";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFields>({
    defaultValues: {
      companyName: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (ready && user) {
      router.replace("/dashboard");
    }
  }, [ready, user, router]);

  const onSubmit = async (fields: AuthFields) => {
    if (isRegister) {
      createAccount({
        companyName: fields.companyName!.trim(),
        email: fields.email.trim(),
      });
    } else {
      logIn(fields.email.trim());
    }

    router.push("/dashboard");
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_0.9fr]">
      <section className="flex min-h-screen flex-col px-6 py-7 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between">
          <Brand />

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-[#777] hover:text-black"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-100 flex-1 flex-col justify-center py-14">
          <div className="mb-8 flex size-12 items-center justify-center rounded-2xl bg-[#f1f3ec]">
            <Sprout size={21} />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#858581]">
            {isRegister ? "Start building" : "Welcome back"}
          </p>

          <h1 className="mt-3 text-[38px] font-semibold leading-tight tracking-[-0.065em]">
            {isRegister
              ? "Create your workspace."
              : "Good to see you."}
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#777]">
            {isRegister
              ? "One simple place to launch and grow your game campaigns."
              : "Log in to check on your games and campaigns."}
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-9 space-y-5"
            noValidate
          >
            {isRegister && (
              <Field
                label="Company name"
                error={errors.companyName?.message}
              >
                <input
                  {...register("companyName", {
                    required: "Enter your company name.",
                    minLength: {
                      value: 2,
                      message: "Use at least 2 characters.",
                    },
                  })}
                  autoComplete="organization"
                  placeholder="Your studio"
                  className={inputClass}
                />
              </Field>
            )}

            <Field label="Email address" error={errors.email?.message}>
              <input
                {...register("email", {
                  required: "Enter your email address.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
                type="email"
                autoComplete="email"
                placeholder="you@yourstudio.com"
                className={inputClass}
              />
            </Field>

            <Field label="Password" error={errors.password?.message}>
              <input
                {...register("password", {
                  required: "Enter a password.",
                  minLength: {
                    value: 8,
                    message: "Use at least 8 characters.",
                  },
                })}
                type="password"
                autoComplete={
                  isRegister ? "new-password" : "current-password"
                }
                placeholder="At least 8 characters"
                className={inputClass}
              />
            </Field>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#151515] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#333] disabled:opacity-60"
            >
              {isRegister ? "Create workspace" : "Log in"}
              <ArrowRight size={15} />
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#777]">
            {isRegister
              ? "Already have a workspace?"
              : "New to PlayGrow?"}{" "}
            <Link
              href={isRegister ? "/login" : "/register"}
              className="font-medium text-[#171717] underline underline-offset-4"
            >
              {isRegister ? "Log in" : "Create an account"}
            </Link>
          </p>

          <p className="mt-9 text-center text-[11px] leading-5 text-[#999]">
            Frontend preview: your workspace is saved in this browser only.
          </p>
        </div>

        <p className="text-xs text-[#999]">© 2026 PlayGrow</p>
      </section>

      <aside className="relative hidden overflow-hidden bg-[#161616] px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 top-24 size-105 rounded-full border border-white/10" />

        <div className="absolute -right-6 top-44 size-75 rounded-full border border-white/10" />

        <div className="absolute right-20 top-72.5 size-36 rounded-full border border-[#d5f2b1]/30" />

        <div className="relative z-10 flex items-center justify-between text-xs text-white/55">
          <span>THE PLAYGROW WORKSPACE</span>
          <span>01 / 03</span>
        </div>

        <div className="relative z-10 max-w-122.5 pb-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#c1e99a]">
            A little more play
          </p>

          <h2 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-[-0.07em]">
            Turn the next level into a reason to come back.
          </h2>

          <p className="mt-6 max-w-97.5 text-sm leading-6 text-white/60">
            Set milestones that feel good to reach. Give your players a clear
            journey, and your game a stronger start.
          </p>

          <div className="mt-9 flex items-center gap-2">
            <span className="h-1 w-9 rounded-full bg-white" />
            <span className="size-1 rounded-full bg-white/35" />
            <span className="size-1 rounded-full bg-white/35" />
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-white/45">
          <Brand dark />
          <span>Make good games grow.</span>
        </div>
      </aside>
    </main>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-[#e5e5e2] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#aaa] focus:border-[#999]";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-medium text-[#454545]">
      {label}
      {children}
      {error && (
        <span className="mt-1.5 block text-xs font-normal text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}
