import { GuestEntry, GuestData } from "../types/guests";
import { getAuthHeaders } from "./admin";

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

/**
 * Fetch all guests (public)
 */
export const fetchGuests = async (): Promise<GuestData[]> => {
  const res = await fetch("/api/guests");
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch guests");
  }
  return data.data as GuestData[];
};

/**
 * Add a new guest (requires admin auth)
 */
export const addGuest = async (
  firstname: string,
  lastname: string,
): Promise<GuestData> => {
  const res = await fetch("/api/guests", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ firstname, lastname }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to add guest");
  }
  return data.data as GuestData;
};

/**
 * Edit a guest by ID (requires admin auth)
 */
export const editGuest = async (
  id: string,
  firstname: string,
  lastname: string,
): Promise<GuestData> => {
  const res = await fetch(`/api/guests/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ firstname, lastname }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to edit guest");
  }
  return data.data as GuestData;
};

/**
 * Delete a guest by ID (requires admin auth)
 */
export const deleteGuest = async (id: string): Promise<void> => {
  const res = await fetch(`/api/guests/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to delete guest");
  }
};
