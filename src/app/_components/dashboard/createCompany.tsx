/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Autocomplete from "react-google-autocomplete";
import { Suspense, useState } from "react";
import { UploadHandler } from "./uploadHandler";

type Inputs = {
  companyName: string;
  description: string;
  address: string;
  email: string;
  siteUrl: string;
};

export const CreateCompany = ({
  setIsCreateOpen,
}: {
  setIsCreateOpen: (value: boolean) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<Inputs>();
  const router = useRouter();
  const googleApi = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [image, setImage] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string>("");

  const createCompany = api.company.createCompany.useMutation({
    onSuccess: () => {
      router.refresh();
      reset();
      setImage(undefined);
      setIsCreateOpen(false);
    },
    onError(error) {
      console.error("Error creating company", error);
      setError("root.serverError", {
        message: error.message,
      });
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (!address) {
      setError("address", {
        message: "Address is required",
      });
      return;
    }
    createCompany.mutate({
      name: data.companyName,
      description: data.description,
      location: address,
      email: data.email,
      imageUrl: image,
      siteUrl: data.siteUrl,
    });
  };

  return (
    <div className="relative flex h-auto w-full  justify-center  rounded-xl border bg-white/90 px-12 py-3 shadow ">
      <div
        onClick={() => {
          setIsCreateOpen(false);
        }}
        className=" absolute right-[15px] top-[5px] cursor-pointer text-2xl transition duration-100"
      >
        x
      </div>
      <form
        className=" max-w-4/5 flex w-full flex-col items-center gap-3"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
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
            onInput={() => {
              clearErrors("address");
            }}
            options={{
              componentRestrictions: { country: ["es"] },
            }}
            language="en"
            autoCorrect="yes"
          />
        </Suspense>
        {errors?.address?.message && (
          <p className="text-center text-sm italic text-red-500">
            {errors.address.message}
          </p>
        )}
        <div className="relative flex w-full justify-center">
          <label className="text-sm font-bold text-black ">Site Url</label>
          <p className="absolute  right-0 text-sm">optional</p>
        </div>

        <input
          id="siteUrl"
          className=" focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          placeholder="Enter company website link"
          {...register("siteUrl")}
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
          value="Create Company"
        />
        {errors?.root?.serverError?.message && (
          <p className="text-center text-sm italic text-red-500">
            {errors.root.serverError.message}
          </p>
        )}
      </form>
    </div>
  );
};
