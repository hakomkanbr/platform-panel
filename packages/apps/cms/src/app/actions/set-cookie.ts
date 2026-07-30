"use server";
import { cookies } from 'next/headers'


export async function setCookie(name: string, value: string) {
    cookies().set(name, value,
        {
            domain: process.env.NODE_ENV == "production" ? ".bremix.tech" : "localhost",
            path: "/",
            secure: true,
            sameSite: "none"
        }
    );
}

export async function deleteCookie(name: string) {
    if (cookies().has(name)) {
        return cookies().delete(name)
    }

    return null;
}

export async function getcookies() {
    return await cookies().getAll();
}

export async function getCookie(name: string) {
    if (cookies().has(name)) {
        return cookies().get(name)?.value ?? "";
    }

    return null;
}