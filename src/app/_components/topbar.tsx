import { SignInButton, SignOutButton, currentUser } from "@clerk/nextjs";
import Link from "next/link";

export const Topbar = async () => {
  const user = await currentUser();

  return (
    <header className="flex h-auto w-full flex-col justify-center  bg-stone-900/95 px-2 py-6 text-center align-middle text-[0.8rem] font-semibold tracking-tight text-white">
      <div className="mb-2">
        <Link
          href="/"
          className="group relative text-4xl tracking-wider opacity-90"
        >
          Construct Jobs
          <span className="absolute bottom-0 left-0 h-1 w-0 bg-stone-700 transition-all duration-200 ease-in-out group-hover:right-0 group-hover:w-full"></span>
        </Link>
      </div>

      <nav className="mt-2 flex justify-center gap-2 text-base opacity-90">
        <Link
          href="/"
          className="cursor-pointer rounded-lg px-4 py-2 transition-all duration-200 hover:bg-stone-700"
        >
          Jobs
        </Link>
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="cursor-pointer rounded-lg px-4 py-2 transition-all duration-200 hover:bg-stone-700"
            >
              Dashboard
            </Link>
            <SignOutButton>
              <button className="cursor-pointer rounded-lg px-4 py-2 transition-all duration-200 hover:bg-stone-700">
                Logout
              </button>
            </SignOutButton>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="cursor-pointer rounded-lg px-4 py-2 transition-all duration-200 hover:bg-stone-700"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="cursor-pointer rounded-lg bg-yellow-400 px-4 py-2 text-black/90 transition-all duration-200 hover:bg-yellow-400/70"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};
