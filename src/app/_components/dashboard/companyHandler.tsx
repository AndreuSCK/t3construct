"use client";
import { useState } from "react";
import { CreateCompany } from "./createCompany";
import { CompanyList } from "./companyList";

import { ModifyCompany } from "./modifyCompany";
import type { inferRouterOutputs } from "@trpc/server";
import { type companyRouter } from "~/server/api/routers/company";
import { CurrentJobList } from "./currentJobList";
import { useRouter } from "next/navigation";
type RouterOutput = inferRouterOutputs<typeof companyRouter>;
interface CompanyHandlerProps {
  companies: RouterOutput["getUserCompanies"];
}
export const CompanyHandler: React.FC<CompanyHandlerProps> = ({
  companies,
}) => {
  const router = useRouter();
  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isModifyOpen, setIsModifyOpen] = useState<boolean>(false);
  const refreshHandler = () => {
    router.refresh();
  }
  return (
    <div className="flex w-full flex-col gap-4">
      <CompanyList
        companies={companies}
        isListOpen={isListOpen}
        isModifyOpen={isModifyOpen}
        isCreateOpen={isCreateOpen}
        setIsListOpen={setIsListOpen}
        setIsCreateOpen={setIsCreateOpen}
        setIsModifyOpen={setIsModifyOpen}
      />
      {isCreateOpen && <CreateCompany setIsCreateOpen={setIsCreateOpen} />}
      {isModifyOpen && companies[0] && (
        <ModifyCompany
          setIsModifyOpen={setIsModifyOpen}
          currentCompany={companies[0]}
          refreshHandler={refreshHandler}
        />
      )}
      {/* a simple 1px bar */}
      <div className="w-full h-1 bg-stone-300" />
      {companies[0] && <CurrentJobList company={companies[0]} />}
    </div>
  );
};
