/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { Suspense, useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/trpc/react";
import type { inferRouterOutputs } from "@trpc/server";
import { type companyRouter } from "~/server/api/routers/company";
type RouterOutput = inferRouterOutputs<typeof companyRouter>;

type Inputs = {
  title: string;
  description: string;
  location: string;
  jobUrl: string;
};
export const AddNewJob = ({
  company,
  refetchJobs,
}: {
  company: RouterOutput["getUserCompanies"][number];
  refetchJobs: () => void;
}) => {
  const googleApi = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm<Inputs>();

  const [isAddingNewJob, setIsAddingNewJob] = useState(false);
  const [address, setAddress] = useState<string>("");

  const postJob = api.job.post.useMutation({
    onSuccess: () => {
      setIsAddingNewJob(false);
      reset();
      refetchJobs();
    },
    onError(error) {
      console.error("Error creating company", error);
      setError("root.serverError", {
        message: error.message,
      });
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    postJob.mutate({
      title: data.title,
      description: data.description,
      location: address || company.location,
      companyId: company.id,
      jobUrl: data.jobUrl,
    });
  };
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex h-auto w-full cursor-pointer items-center justify-start gap-4 rounded-xl border bg-white/90 p-2 px-8 shadow transition duration-100 hover:bg-white/70 "
        onClick={() => {
          setIsAddingNewJob(true);
        }}
      >
        <div className="full h-8 w-8 rounded-full bg-cyan-950/90 leading-[1.9rem] text-white">
          +
        </div>

        <h2 className="pt-[2px] font-semibold ">Post a new job for free</h2>
      </div>
      {isAddingNewJob && (
        <div className="relative mt-2 flex h-auto w-full flex-col justify-center gap-4 rounded-xl border bg-white/90 p-2 px-8 shadow transition duration-100 hover:bg-white/70 ">
          <div
            onClick={() => {
              setIsAddingNewJob(false);
              reset();
            }}
            className="absolute right-4 top-2 cursor-pointer font-medium"
          >
            x
          </div>
          <form
            className=" max-w-4/5 flex w-full flex-col items-center gap-3 pt-1"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label
              className="block text-sm font-bold text-black "
              htmlFor="title"
            >
              Title
            </label>
            <input
              id="title"
              className=" focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              placeholder="Enter job title"
              {...register("title", {
                required: "Job title is required",
              })}
            />
            {errors?.title?.message && (
              <p className="text-center text-sm italic text-red-500">
                {errors.title.message}
              </p>
            )}
            <label
              className="block text-sm font-bold text-black "
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 text-sm leading-tight text-gray-700 shadow focus:outline-none"
              placeholder="Enter job description"
              {...register("description", {
                required: "Job description is required",
              })}
            />
            {errors?.description?.message && (
              <p className="text-center text-sm italic text-red-500">
                {errors.description.message}
              </p>
            )}
            <div className="relative flex w-full justify-center">
              <label
                htmlFor="location"
                className="text-sm font-bold text-black "
              >
                Location
              </label>
              <p className="absolute  right-0 text-sm">optional</p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <Autocomplete
                className="w-full rounded border px-3 py-1 shadow"
                apiKey={googleApi}
                onPlaceSelected={(place) => {
                  if (place.formatted_address) {
                    setAddress(place.formatted_address);
                  } else if (place?.name) {
                    setAddress(place.name);
                  }
                }}
                onInput={() => {
                  clearErrors("location");
                }}
                options={{
                  componentRestrictions: { country: ["es"] },
                }}
                language="en"
                autoCorrect="yes"
              />
            </Suspense>
            {errors?.location?.message && (
              <p className="text-center text-sm italic text-red-500">
                {errors.location.message}
              </p>
            )}
            <div className="relative flex w-full justify-center">
              <label htmlFor="jobUrl" className="text-sm font-bold text-black ">
                Job Link
              </label>
              <p className="absolute  right-0 text-sm">optional</p>
            </div>
            <input
              id="jobUrl"
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 text-sm leading-tight text-gray-700 shadow focus:outline-none"
              placeholder="Enter Job Link URL"
              {...register("jobUrl")}
            />
            {errors?.jobUrl?.message && (
              <p className="text-center text-sm italic text-red-500">
                {errors.jobUrl.message}
              </p>
            )}
            <input
              className="focus:shadow-outline cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white shadow hover:bg-blue-700 focus:outline-none"
              type="submit"
              value="Submit Job"
            />
          </form>
        </div>
      )}
    </div>
  );
};
