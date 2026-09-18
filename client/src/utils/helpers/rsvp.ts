import { RSVPDetails } from "../types/rsvp";

export const submitRsvp = async (payload: RSVPDetails): Promise<string> => {
  const res = await fetch("/api/rsvp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: { message?: string } = {};
  try {
    data = await res.json();
  } catch {
    // Server returned an empty or non-JSON body (e.g. the server is down)
    throw new Error("Unexpected response from server. Please try again.");
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data.message as string;
};

export const findRsvpByName = async (
  firstname: string,
  lastname: string,
): Promise<RSVPDetails | null> => {
  const res = await fetch(
    `/api/rsvp/search?firstname=${encodeURIComponent(firstname.trim())}&lastname=${encodeURIComponent(lastname.trim())}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (res.status === 404) return null;

  let data: { data?: RSVPDetails; message?: string } = {};
  try {
    data = await res.json();
  } catch {
    throw new Error("Unexpected response from server. Please try again.");
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data.data ?? null;
};
