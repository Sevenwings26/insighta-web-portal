// lib/api.js (updated with export support)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 401) {
    const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      return fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired");
    }
  }

  return response;
}

export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) => apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  }),
  put: (endpoint, data) => apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => apiRequest(endpoint, {
    method: "DELETE",
  }),
};



// // lib/api.js
// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// async function apiRequest(endpoint, options = {}) {
//   const response = await fetch(`${BASE_URL}${endpoint}`, {
//     ...options,
//     credentials: "include", // ✅ Send HTTP-only cookies
//     headers: {
//       "Content-Type": "application/json",
//       ...options.headers,
//     },
//   });

//   // Handle token refresh if needed
//   if (response.status === 401) {
//     // Try to refresh the token
//     const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
//       method: "POST",
//       credentials: "include",
//     });

//     if (refreshResponse.ok) {
//       // Retry original request with new token (cookies automatically sent)
//       return fetch(`${BASE_URL}${endpoint}`, {
//         ...options,
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           ...options.headers,
//         },
//       });
//     } else {
//       // Refresh failed, redirect to login
//       if (typeof window !== "undefined") {
//         window.location.href = "/login";
//       }
//       throw new Error("Session expired");
//     }
//   }

//   return response;
// }

// export const api = {
//   get: (endpoint) => apiRequest(endpoint),
//   post: (endpoint, data) => apiRequest(endpoint, {
//     method: "POST",
//     body: JSON.stringify(data),
//   }),
//   put: (endpoint, data) => apiRequest(endpoint, {
//     method: "PUT",
//     body: JSON.stringify(data),
//   }),
//   delete: (endpoint) => apiRequest(endpoint, {
//     method: "DELETE",
//   }),
// };


// // import {
// //   getAccessToken,
// //   getRefreshToken,
// //   saveTokens,
// //   clearTokens,
// // } from "./storage";

// // const BASE_URL =
// //   process.env.NEXT_PUBLIC_API_URL;

// // export async function refreshAccessToken() {
// //   const refreshToken = getRefreshToken();

// //   if (!refreshToken) return false;

// //   const response = await fetch(
// //     `${BASE_URL}/auth/refresh`,
// //     {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         "X-API-Version": "1",
// //       },
// //       body: JSON.stringify({
// //         refresh_token: refreshToken,
// //       }),
// //     }
// //   );

// //   if (!response.ok) {
// //     clearTokens();
// //     return false;
// //   }

// //   const data = await response.json();

// //   saveTokens(data);

// //   return true;
// // }


// // export async function apiRequest(endpoint, options = {}) {
// //   let token = getAccessToken();

// //   let response = await fetch(`${BASE_URL}${endpoint}`, {
// //     ...options,
// //     credentials: "include", // CRITICAL for Stage 3 Cookies
// //     headers: {
// //       "Content-Type": "application/json",
// //       "X-API-Version": "1",
// //       Authorization: token ? `Bearer ${token}` : "",
// //       ...(options.headers || {}),
// //     },
// //   });

// //   // Auto-refresh logic
// //   if (response.status === 401) {
// //     const refreshed = await refreshAccessToken();

// //     if (!refreshed) {
// //       if (typeof window !== "undefined") window.location.href = "/login";
// //       return response;
// //     }

// //     token = getAccessToken();
// //     response = await fetch(`${BASE_URL}${endpoint}`, {
// //       ...options,
// //       credentials: "include", // Include here too
// //       headers: {
// //         "Content-Type": "application/json",
// //         "X-API-Version": "1",
// //         Authorization: `Bearer ${token}`,
// //         ...(options.headers || {}),
// //       },
// //     });
// //   }

// //   return response;
// // }
