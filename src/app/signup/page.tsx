import { SignUpButton } from "@clerk/nextjs";

export default async function Signup() {
  return (
      <div className="flex w-full flex-col items-center gap-8 p-8 text-center">
        <h1 className="text-5xl font-extrabold text-[#1d2e3b]">
          Construction Jobs in Spain
        </h1>
        <h2 className=" text-xl font-extrabold text-black/80">
          Get Access to Construction Jobs, and Companies
        </h2>

        <SignUpButton redirectUrl="/dashboard" mode="modal">
          <button className="shadow rounded-lg bg-green-600/90 px-12 py-4 text-xl font-medium text-white transition-all duration-200 hover:bg-green-600/75">
            Sign Up for Free
          </button>
        </SignUpButton>
      </div>
  );
}
