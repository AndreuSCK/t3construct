// import Link from "next/link";
import { api } from "~/trpc/server";
import { Jobcard } from "./_components/jobcard";

export default async function Home() {
  return (
    <main className="flex min-h-screen w-full  flex-col items-center bg-stone-300 text-white">
      <div className="container flex flex-col items-center  px-4 py-16 ">
        <ShowJobs />
      </div>
    </main>
  );
}

async function ShowJobs() {
  const hello = await api.job.getAll();
  return (
    <div className="flex w-full flex-col items-center gap-5">
      {hello.length === 0 ? (
        <div className="text-xl text-black">No current jobs available.</div>
      ) : null}
      {hello.map((item, index) => (
        <Jobcard job={item} key={index} />
      ))}
    </div>
  );
  // return (
  //   <div className="w-full max-w-xs">
  //     {latestPost ? (
  //       <p className="truncate">Your most recent post: {latestPost.name}</p>
  //     ) : (
  //       <p>You have no posts yet.</p>
  //     )}
  //     <CreatePost />
  //   </div>
  // );
}

{/* 
  const user = await currentUser();
  <SignInButton mode="modal"/>
<SignedIn>
  SIGNED IN {user?.gender} {user?.username}++ 
</SignedIn>

<SignedOut>
  Sign out
</SignedOut>
<UserButton showName/>
<h3>patata</h3>
<SignOutButton />
available
<SignUpButton mode="modal">
<button>
  Sign up
</button>
</SignUpButton> */}