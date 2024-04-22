"use client";
import type { inferRouterOutputs } from "@trpc/server";
import { type companyRouter } from "~/server/api/routers/company";
import { api } from "~/trpc/react";
import { AddNewJob } from "./addNewJob";
import formatDateFromNow from "~/app/_utils/formatDate";
import { OptionsIcon } from "../icons/options";
import { useState } from "react";
import { ModifyJob } from "./modifyJob";
type RouterOutput = inferRouterOutputs<typeof companyRouter>;

export const CurrentJobList = ({
  company,
}: {
  company: RouterOutput["getUserCompanies"][number];
}) => {
  const currentJobs = api.company.getCompanyJobs.useQuery(company.id);
  const [modifyJob, setModifyJob] = useState<string | null>(null);
  const refetchJobs = () => currentJobs.refetch();
  return (
    <div className=" flex flex-col gap-4">
      <AddNewJob company={company} refetchJobs={refetchJobs}/>
      {currentJobs.data?.map((job) => (
        <div key={job.id}>
          <div className="relative flex min-h-12 w-full max-w-2xl  items-center rounded-xl bg-white p-4 text-black shadow-md transition-colors duration-200 hover:bg-stone-100">
            <div className="flex flex-col text-left">
              <h3 className=" text-xl font-bold text-stone-900/80">
                {job.title}
              </h3>
              <p className="text-base">
                {job.location} • {formatDateFromNow(job.createdAt)}
              </p>
            </div>
            <div
              className="absolute right-4 top-4 flex  h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-stone-400/40"
              onClick={() => {
                setModifyJob(modifyJob === job.id ? null : job.id);
              }}
            >
              <OptionsIcon />
            </div>
          </div>
          {modifyJob === job.id && <ModifyJob job={job} company={company} setModifyJob={setModifyJob} refetchJobs={refetchJobs}/>}
        </div>
      ))}
    </div>
  );
};
