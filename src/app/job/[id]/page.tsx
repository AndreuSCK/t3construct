"use client";
import Image from "next/image";
import { api } from "~/trpc/react";

export default function Page({ params }: { params: { id: string } }) {
  const jobQuery = api.job.get.useQuery(params.id);
  jobQuery.isLoading && <div>Loading...</div>;
  jobQuery.error && <div>Error: {jobQuery.error.message}</div>;
  if (!jobQuery || !jobQuery.data) {
    return <div className="mt-4 text-2xl text-black">Loading...</div>;
  }
  const { data: job } = jobQuery;
  return (
    <div className="mt-4 flex h-full min-h-24 w-full max-w-[600px] flex-col rounded-lg bg-white p-8 text-base text-black shadow">
      {job.company.imageUrl && (
        <Image
          src={job.company.imageUrl}
          alt={job.company.name}
          width={100}
          height={100}
          className=" rounded-lg "
        />
      )}
      <h1 className="py-2 text-3xl font-bold text-black/80">{job.title}</h1>
      <div className="flex">
        <h2 className="font-bold ">Company:</h2>
        <p className="ml-1">{job.company.name}</p>
      </div>
      <div className="flex">
        <h2 className="font-bold ">Location:</h2>
        <p className="ml-1">{job.location}</p>
      </div>
      <div className="flex">
        <h2 className="font-bold ">Posted on:</h2>
        <p className="ml-1">{job.createdAt.toLocaleDateString()}</p>
      </div>
      <h2 className="font-bold">Description:</h2>
      <p>{job.description}</p>
      {job.jobUrl && (
        <a
          href={job.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-32 justify-center rounded-lg bg-yellow-500/50 p-2 text-sm text-black hover:bg-yellow-500/70 hover:underline"
        >
          Visit Job Link
        </a>
      )}
    </div>
  );
}
