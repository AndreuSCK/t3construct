/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Autocomplete from "react-google-autocomplete";
import { Suspense, useEffect, useState } from "react";
import { UploadHandler } from "./uploadHandler";

import type { inferRouterOutputs } from "@trpc/server";
import { type companyRouter } from "~/server/api/routers/company";
type RouterOutput = inferRouterOutputs<typeof companyRouter>;

type Inputs = {
  companyName: string;
  description: string;
  address: string;
  email: string;
  siteUrl: string;
};

export const ModifyCompany = ({
  setIsModifyOpen,
  currentCompany,
}: {
  setIsModifyOpen: (value: boolean) => void;
  currentCompany: RouterOutput["getUserCompanies"][number];
  refreshHandler: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<Inputs>();
  const router = useRouter();
  const googleApi = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [image, setImage] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string>("");
  const [isCompanyUpdated, setIsCompanyUpdated] = useState<boolean>(false);
  const [isCompanyBeingDeleted, setIsCompanyBeingDeleted] =
    useState<boolean>(false);

  const deleteCompany = api.company.deleteCompany.useMutation({
    onSuccess: () => {
      router.refresh();
      setIsModifyOpen(false);
    },
  });

  const modifyCompany = api.company.modifyCompany.useMutation({
    onSuccess: () => {
      setIsCompanyUpdated(true);
      router.refresh();
      reset();
      setImage(undefined);
    },
    onError(error) {
      console.error("Error creating company", error);
      setError("root.serverError", {
        message: error.message,
      });
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setIsCompanyUpdated(false);
    modifyCompany.mutate({
      id: currentCompany.id,
      name: data.companyName,
      description: data.description,
      location: address,
      email: data.email,
      imageUrl: image,
      siteUrl: data.siteUrl,
    });
  };
  const populateForm = (company: RouterOutput["getUserCompanies"][number]) => {
    reset({
      companyName: company.name,
      description: company.description || "",
      email: company.email,
      address: company.location,
      siteUrl: company.siteUrl || "",
    });
    if (company.imageUrl) {
      setImage(company.imageUrl);
    }
    if (company.location) {
      setAddress(company.location);
    }
  };
  console.log(currentCompany)
  useEffect(() => {
    populateForm(currentCompany);
  }, [currentCompany]);

  const deleteCurrentCompany = () => {
    deleteCompany.mutate(currentCompany.id);
  };
  return (
    <div className="relative flex h-auto w-full  flex-col items-center justify-center rounded-xl border bg-white/90 px-12 py-3 shadow ">
      <div
        onClick={() => {
          setIsModifyOpen(false);
        }}
        className=" absolute right-[15px] top-[5px] cursor-pointer text-2xl transition duration-100"
      >
        x
      </div>
      <form
        className=" max-w-4/5 flex w-full flex-col items-center gap-3"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <label
          className="block text-sm font-bold text-black "
          htmlFor="companyName"
        >
          Company Name
        </label>
        <input
          id="companyName"
          className=" focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          placeholder="Enter company name"
          {...register("companyName", {
            required: "Company name is required",
          })}
        />
        {errors?.companyName?.message && (
          <p className="text-center text-sm italic text-red-500">
            {errors.companyName.message}
          </p>
        )}

        <label className="block text-sm font-bold text-black " htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className=" focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          placeholder="Enter company email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Entered value does not match email format",
            },
          })}
          data-error={errors?.email?.message?.toString()}
        />
        {errors?.email?.message && (
          <p className="text-center text-sm italic text-red-500">
            {errors.email.message}
          </p>
        )}
        <div className="relative flex w-full justify-center">
          <label className="text-sm font-bold text-black ">Address</label>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Autocomplete
            className="w-full rounded border px-3 py-1 shadow"
            apiKey={googleApi}
            onPlaceSelected={(place) => {
              if (place?.formatted_address) {
                setAddress(place.formatted_address);
              } else if (place?.name) {
                setAddress(place.name);
              }
            }}
            placeholder="Enter company location"
            defaultValue={address}
            options={{
              componentRestrictions: { country: ["es"] },
            }}
            language="en"
            autoCorrect="yes"
          />
        </Suspense>
        <div className="relative flex w-full justify-center">
          <label className="text-sm font-bold text-black ">Site Url</label>
          <p className="absolute  right-0 text-sm">optional</p>
        </div>

        <input
          id="siteUrl"
          className=" focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          placeholder="Enter company website link"
          {...register("siteUrl", {
            pattern: {
              value:
                /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,10}(:[0-9]{1,5})?(\/.*)?$/,
              message: "Not a valid URL",
            },
          })}
          data-error={errors?.siteUrl?.message?.toString()}
        />
        {errors?.siteUrl?.message && (
          <p className="text-center text-sm italic text-red-500">
            {errors.siteUrl.message}
          </p>
        )}

        <UploadHandler setImage={setImage} image={image} />
        <input
          className="focus:shadow-outline cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white shadow hover:bg-blue-700 focus:outline-none"
          type="submit"
          value="Update Company Details"
        />
        {errors?.root?.serverError?.message && (
          <p className="text-center text-sm italic text-red-500">
            {errors.root.serverError.message}
          </p>
        )}
        {isCompanyUpdated && (
          <p className="text-center text-sm font-bold italic text-green-500">
            Company details updated successfully
          </p>
        )}
      </form>
      <button
        className="focus:shadow-outline my-3 w-40 cursor-pointer rounded bg-red-500/50 px-4 py-2 text-center text-sm font-bold text-white shadow hover:bg-red-500/90 focus:outline-none"
        onClick={() => setIsCompanyBeingDeleted(true)}
      >
        Delete Company
      </button>
      {isCompanyBeingDeleted && (
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm font-bold italic text-red-500">
            Confirm company & all job deletion?
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsCompanyBeingDeleted(false)}
              className="focus:shadow-outline w-20 cursor-pointer rounded bg-blue-500 px-4 py-2 text-center text-sm font-bold text-white shadow hover:bg-blue-700 focus:outline-none"
            >
              No
            </button>
            <button
              onClick={deleteCurrentCompany}
              className="focus:shadow-outline w-20 cursor-pointer rounded bg-red-500 px-4 py-2 text-center text-sm font-bold text-white shadow hover:bg-red-700 focus:outline-none"
            >
              Yes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
