import Link from "next/link";

export const Topbar = async () => {
  return (
    <header className="flex h-auto w-full flex-col justify-center  bg-stone-900 px-2 py-8 text-center align-middle text-[0.8rem] font-semibold tracking-tight text-white">
      <div>
        <Link
          href="/"
          className="group relative text-3xl tracking-wider opacity-90"
        >
          Construct Jobs
          <span className="absolute bottom-0 left-0 h-1 w-0 bg-stone-700 transition-all duration-200 ease-in-out group-hover:right-0 group-hover:w-full"></span>
        </Link>
      </div>

      <nav className=" pt-4 text-base opacity-90">
        <Link
          href="/"
          className="cursor-pointer rounded-lg px-2 py-1 transition-all duration-200 hover:bg-stone-700"
        >
          Jobs
        </Link>
        <Link
          href="/add-job"
          className="cursor-pointer rounded-lg px-2 py-1 transition-all duration-200 hover:bg-stone-700"
        >
          Add Job
        </Link>

        <Link
          href="/dashboard"
          className="cursor-pointer rounded-lg px-2 py-1 transition-all duration-200 hover:bg-stone-700"
        >
          Dashboard
        </Link>
      </nav>
    </header>
  );
};
