const BASE_URL = "https://jsonplaceholder.typicode.com";

export async function apiGet(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}