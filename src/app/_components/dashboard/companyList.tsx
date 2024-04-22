import { useRouter } from "next/navigation";
import { FirstLetterUppercase } from "~/app/_utils/firstLetterUppercase";
import { api } from "~/trpc/react";
import { Barsarrowdown, Barsarrowup } from "../icons/barsarrow";
import { OptionsIcon } from "../icons/options";

import type { inferRouterOutputs } from "@trpc/server";
import { type companyRouter } from "~/server/api/routers/company";
type RouterOutput = inferRouterOutputs<typeof companyRouter>;

export const CompanyList = ({
  companies,
  isListOpen,
  isCreateOpen,
  isModifyOpen,
  setIsListOpen,
  setIsModifyOpen,
  setIsCreateOpen,
}: {
  companies: RouterOutput["getUserCompanies"];
  isListOpen: boolean;
  isCreateOpen: boolean;
  isModifyOpen: boolean;
  setIsListOpen: (value: boolean) => void;
  setIsModifyOpen: (value: boolean) => void;
  setIsCreateOpen: (value: boolean) => void;
}) => {
  const router = useRouter();

  const changeMainCompany = api.company.setMainCompany.useMutation({
    onSuccess: () => {
      router.refresh();
      setIsListOpen(false);
      console.log("Company changed successfully");
    },
    onError: (error, variables, context) => {
      console.error("Error changing company", error);
    },
  });

  return (
    <div className=" flex w-full flex-col gap-2">
      {companies
        .slice(0, isListOpen ? companies.length : 1)
        .map((company, index) => (
          <div
            key={index}
            onClick={() => {
              if (index !== 0) {
                changeMainCompany.mutate(company.id);
              }
            }}
            className={`${index !== 0 && "cursor-pointer"}  flex h-auto w-full items-center justify-between gap-4 rounded-xl border bg-white/90 p-2 px-8 shadow transition duration-100 hover:bg-white/70 `}
          >
            <div className="flex gap-4 items-center">
              {company.imageUrl ? (
                <img
                  src={company.imageUrl}
                  alt="Company Logo"
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="full h-8 w-8 rounded-full bg-gray-500/90 leading-8">
                  {company.name[0]}
                </div>
              )}
              <div className="flex flex-col justify-start text-left">
                <h2 className="font-semibold text-lg">
                  {FirstLetterUppercase(company.name)}
                </h2>
                <h3 className="text-sm">{company.email}</h3>
              </div>
            </div>
            {index === 0 && (
              <div className="flex  gap-4">
                <div
                  className=" flex  h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-stone-400/40"
                  onClick={() => {
                    setIsModifyOpen(!isModifyOpen);
                    setIsListOpen(false);
                    setIsCreateOpen(false);
                  }}
                >
                  <OptionsIcon />
                </div>
                <div
                  onClick={() => {
                    setIsListOpen(!isListOpen);
                    setIsModifyOpen(false);
                  }}
                  className="flex h-9 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-stone-400/40"
                >
                  {isListOpen ? <Barsarrowup /> : <Barsarrowdown />}
                </div>
              </div>
            )}
          </div>
        ))}
      {(companies.length === 0 || isListOpen) && (
        <div
          className="flex h-auto w-full cursor-pointer items-center justify-start gap-4 rounded-xl border bg-white/90 p-2 px-8 shadow transition duration-100 hover:bg-white/70 "
          onClick={() => {
            setIsListOpen(false);
            setIsModifyOpen(false);
            setIsCreateOpen(true);
          }}
        >
          <div className="full h-8 w-8 rounded-full bg-cyan-950/90 leading-[1.9rem] text-white">
            +
          </div>
          <h2 className="pt-[2px] underline ">Add Company</h2>
        </div>
      )}
    </div>
  );
};
