'use server';

import route_paths from "@/helper/route_paths";
import { redirect } from "next/navigation";
import { deleteCookie } from "./set-cookie";


export async function logout() {
    redirect(route_paths.auth.login);
}