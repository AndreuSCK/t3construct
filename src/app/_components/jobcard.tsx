import Image from "next/image";
import formatDate from "../_utils/formatDate";
import type { inferRouterOutputs } from "@trpc/server";
import { type jobRouter } from "~/server/api/routers/job";
type RouterOutput = inferRouterOutputs<typeof jobRouter>;

export const Jobcard = ({ job }: { job: RouterOutput["getAll"][number] }) => {


  return (
    <div className="relative flex min-h-12 w-full max-w-4xl  items-center rounded-lg bg-white hover:bg-stone-100 p-4 text-black shadow-md transition-colors duration-300">
      <Image
        src="/companypic.png"
        className=" mr-5 h-auto w-auto rounded-lg"
        alt="Company Logo"
        width={60}
        height={60}
      />
      <div>
        <h3 className=" text-xl font-bold text-stone-900/80">{job.title}</h3>
        <p>
          {job.company.name} • {job.company.location}
        </p>
      </div>
      <div className="absolute bottom-[5px] right-3 grow text-right text-sm md:static md:text-base">
        <p>{formatDate(job.createdAt)}</p>
      </div>
    </div>
  );
};
