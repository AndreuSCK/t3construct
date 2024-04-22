'use client'

export const CreateNewCompany = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className="flex h-auto w-full cursor-pointer justify-center gap-4 rounded-xl border bg-white/90 p-2 px-8 shadow transition duration-100 hover:bg-white/70"
      onClick={onClick}
    >
      <div className="relative h-8 w-8 rounded-full bg-stone-400/40">
        <p className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full">
          +
        </p>
      </div>
      <h2 className="pt-[2px]">Create new company..</h2>
    </div>
  );
};
