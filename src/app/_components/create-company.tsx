"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "~/trpc/react";

export default function CreateCompany() {
  const router = useRouter();
  const createCompany = api.company.createCompany.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError(error, variables, context) {
      console.error("Error creating company", error);
    },
  });

  // useEffect(() => {
  //   createCompany.mutate({
  //     description: "mejores boles sl",
  //     name: "boles de arroz SL",
  //     location: "New York",
  //     title: "Software Engineer",
  //     email: "arajul@hotmail.com",
  //   });
  // }, []);

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const result = createCompany.mutate({
  //     description: "mejores boles sl",
  //     name: "boles de arroz SL",
  //     location: "New York",
  //     title: "Software Engineer",
  //     email: "arajul@hotmail.com",
  //   });
  // };

  return (
    <div>
      <form
        className="mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          createCompany.mutate({
            description: "mejores boles sl",
            name: "bolesdearrozSL",
            location: "NewYork",
            email: "arajul@hotmail.com",
          });
        }}
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-bold text-black"
          >
            Company Name
          </label>
          <input
            type="text"
            id="name"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            placeholder="Enter company name"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-bold text-black"
          >
            Description
          </label>
          <textarea
            id="description"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            placeholder="Enter company description"
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            type="submit"
          >
            Create Company
          </button>
        </div>
      </form>
    </div>
  );
}
