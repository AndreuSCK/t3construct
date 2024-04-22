"use client";
import Image from "next/image";
import formatDateFromNow from "../_utils/formatDate";
import type { inferRouterOutputs } from "@trpc/server";
import { type jobRouter } from "~/server/api/routers/job";
import { FirstLetterUppercase } from "../_utils/firstLetterUppercase";
import { redirect } from "next/navigation";
import Link from "next/link";
type RouterOutput = inferRouterOutputs<typeof jobRouter>;

export const Jobcard = ({ job }: { job: RouterOutput["getAll"][number] }) => {
  return (
    <div className="group relative flex min-h-12 w-full max-w-2xl  items-center rounded-xl bg-white p-4 text-black shadow-md transition-colors duration-300 hover:bg-stone-100">
      {job.company.imageUrl && (
        <Image
          src={job.company.imageUrl}
          className=" mr-5 h-auto w-auto rounded-lg"
          alt="Company Logo"
          width={64}
          height={64}
        />
      )}
      <div>
        <Link href={`/job/${job.id}`}>
          <h3 className=" w-fit cursor-pointer text-xl font-bold text-stone-900/80 underline-offset-4 hover:text-sky-950 hover:underline">
            {FirstLetterUppercase(job.title)}
          </h3>
        </Link>
        <p>
          {job.company.name} • {job.company.location}
        </p>
      </div>
      <div className="absolute bottom-[5px] right-3 top-[8%] flex items-center text-right text-sm transition-opacity  duration-300 group-hover:opacity-0">
        <p>{formatDateFromNow(job.createdAt)}</p>
      </div>
      <Link href={`/job/${job.id}`}>
        <div className="absolute right-3 top-[30%] h-9 w-fit cursor-pointer rounded-2xl bg-yellow-500/80 p-2  text-sm opacity-0 transition-opacity  duration-300 group-hover:opacity-100">
          More Info
        </div>
      </Link>
    </div>
  );
};
