import { authConfig, loginIsRequiredServer } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const wait = (ms: number) => new Promise((rs) => setTimeout(rs, ms));

export default async function Page() {
  await loginIsRequiredServer();

  const session = await getServerSession(authConfig);

  await wait(1000);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold text-white">Welcome to Superiamo&#39;s Dashboard</h1>
    </div>
  );
}
