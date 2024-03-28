import { SignOutButton } from "@clerk/nextjs";
import { api } from "~/trpc/server";
import CreateCompany from "../_components/create-company";

export default async function Page() {
  const companies = await api.company.getAll();

  return (
    <main className="flex min-h-screen w-full  flex-col items-center bg-stone-300 text-white">
      <h1 className="text-4xl text-black">List of companies</h1>
      {companies.length === 0 ? (
        <div className="text-xl text-black">
          No current companies available.
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-5">
          {companies.map((item, index) => (
            <div
              className="relative flex min-h-12 w-full max-w-4xl  items-center rounded-lg bg-white p-4 text-black shadow-md transition-colors duration-300 hover:bg-stone-100"
              key={index}
            >
              <div>
                <h3 className=" text-xl font-bold text-stone-900/80">
                  {item.name}
                </h3>
                <p>
                  {item.location} {item.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateCompany />
      <SignOutButton />
    </main>
  );
}
