"use client";

import { useEffect } from "react";

import { useRouter }
  from "next/navigation";

import { saveTokens }
  from "@/lib/storage";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const accessToken =
      params.get("access_token");

    const refreshToken =
      params.get("refresh_token");

    if (
      accessToken &&
      refreshToken
    ) {
      saveTokens({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
      "
    >
      Logging you in...
    </div>
  );
}
