import { api } from "~/trpc/server";
import { CompanyHandler } from "../_components/dashboard/companyHandler";

export default async function Page() {
  const fetchedCompanies = await api.company.getUserCompanies();
  const mainCompany = await api.user.getMainCompany();
  const sortedCompanies = fetchedCompanies
    .filter((company) => company.id === mainCompany)
    .concat(fetchedCompanies.filter((company) => company.id !== mainCompany));

  return (
    <div className="mt-4 flex w-full max-w-[520px] flex-col gap-6 p-2 text-center text-lg text-black/80">
      <CompanyHandler companies={sortedCompanies} />
    </div>
  );
}
