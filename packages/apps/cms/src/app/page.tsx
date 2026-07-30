import route_paths from "@/helper/route_paths";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  redirect(route_paths.auth.login);
  return (
    <main>
      <h1>
        Welcome To Bremix Admin Panel 
        <Link href={"/auth/login"}>login page</Link>
      </h1>
    </main>
  );
}
