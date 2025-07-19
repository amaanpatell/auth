// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL:
//     import.meta.env.MODE === "development"
//       ? "http://localhost:8080/api/v1"
//       : "/api/v1",
//   withCredentials: true,
// });

import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8080/api/v1"
      : "/api/v1",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized error (token expired) and ensure it's not a retry or the refresh endpoint itself
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/users/refresh-token"
    ) {
      originalRequest._retry = true; // Mark request as retried

      if (isRefreshing) {
        // If a refresh is in progress, queue the current request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true; // Start the refresh process

      try {
        console.log("Access token expired. Attempting to refresh...");
        // Call the backend's refresh token endpoint
        const refreshResponse = await axiosInstance.post("/users/refresh-access-token");
        console.log("Access token refreshed successfully!");

        isRefreshing = false;
        processQueue(null); // Resolve all queued requests

        // Retry the original failed request with the new access token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        isRefreshing = false;
        processQueue(refreshError, null); // Reject all queued requests

        // Redirect to login if refresh token is invalid/expired
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // For any other error, pass it along
    return Promise.reject(error);
  }
);