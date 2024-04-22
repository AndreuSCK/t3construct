import {
  SignInButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default async function Login() {
  return (
    <div className="mt-4 flex w-full max-w-[550px] flex-col gap-6 p-2 text-center text-lg text-black/80">
      <div className=" flex h-auto w-full flex-col gap-3 rounded-lg bg-white/90 px-12 py-4 pb-5 shadow">
        <h2 className="text-2xl text-left font-bold">Don&apos;t have an account?</h2>
        <Link href="/signup">
          <button className="w-full rounded-lg bg-green-600/90 px-4 py-2 text-xl font-normal text-white shadow transition-all duration-200 hover:bg-green-600/75">
            Sign Up for Free
          </button>
        </Link>
      </div>

      <div className=" flex h-auto w-full flex-col gap-3 rounded-lg bg-white/90 px-12 py-4 pb-5 shadow">
        <h2 className="text-left font-bold text-2xl">Login</h2>
        <p className="text-left">Try it out:</p>
        <p className="text-left">
          Username: <span className="font-bold text-black">guest</span>
        </p>

        <p className="text-left">
          Password:{" "}
          <span className="font-bold text-black">guest123</span>
        </p>
        <SignInButton redirectUrl="/dashboard" mode="modal">
          <button className="rounded-lg bg-green-600/90 px-4 py-2 text-xl font-normal text-white shadow transition-all duration-200 hover:bg-green-600/75">
            <p>Login</p>
          </button>
        </SignInButton>
      </div>
    </div>
  );
}
