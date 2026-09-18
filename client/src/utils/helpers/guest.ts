import { GuestEntry } from "../types/guests";

export const findGuestByName = async (
  firstname: string,
  lastname: string,
): Promise<GuestEntry | null> => {
  const res = await fetch(
    `/api/guests/search?firstname=${encodeURIComponent(firstname.trim())}&lastname=${encodeURIComponent(lastname.trim())}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (res.status === 404) return null;

  let data: { data?: GuestEntry; message?: string } = {};
  try {
    data = await res.json();
  } catch {
    throw new Error("Unexpected response from server. Please try again.");
  }

  if (!res.ok) {
    throw new Error(
      data.message || "Unable to find guest information. Please try again.",
    );
  }

  return data.data ?? null;
};
