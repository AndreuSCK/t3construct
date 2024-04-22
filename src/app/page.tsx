import { api } from "~/trpc/server";
import { Jobcard } from "./_components/jobcard";

export default async function Home() {
  return (
      <div className="container flex flex-col items-center  px-4 py-12 ">
        <ShowJobs />
      </div>
  );
}

async function ShowJobs() {
  const jobs = await api.job.getAll();
  return (
    <div className="flex w-full flex-col items-center gap-5">
      {jobs.length === 0 ? (
        <div className="text-xl text-black">No current jobs available.</div>
      ) : null}
      {jobs.map((item, index) => (
        <Jobcard job={item} key={index} />
      ))}
    </div>
  );
}

