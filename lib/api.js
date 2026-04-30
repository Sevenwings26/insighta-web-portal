// lib/api.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiRequest(
  endpoint,
  options = {}
) {
  let response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-API-Version": "1",
        ...(options.headers || {}),
      },
    }
  );

  // Auto-refresh expired access token
  if (response.status === 401) {
    const refreshResponse = await fetch(
      `${BASE_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "X-API-Version": "1",
        },
      }
    );

    // Refresh successful → retry original request
    if (refreshResponse.ok) {
      response = await fetch(
        `${BASE_URL}${endpoint}`,
        {
          ...options,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-API-Version": "1",
            ...(options.headers || {}),
          },
        }
      );
    } else {
      // Session fully expired
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      throw new Error("Session expired");
    }
  }

  return response;
}

export const api = {
  get: (endpoint) =>
    apiRequest(endpoint),

  post: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (endpoint) =>
    apiRequest(endpoint, {
      method: "DELETE",
    }),
};
