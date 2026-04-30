// app/auth/callback/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function finalizeLogin() {
      try {
        // Verify session using cookies
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-API-Version": "1",
            },
          }
        );

        if (!response.ok) {
          router.push("/login");
          return;
        }

        router.push("/dashboard");
      } catch (error) {
        console.error("Callback auth failed:", error);
        router.push("/login");
      }
    }

    finalizeLogin();
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
