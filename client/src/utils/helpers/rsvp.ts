import { getAuthHeaders } from "./admin";
import { RSVPDetails, RsvpData, RsvpSummary, Attendance } from "../types/rsvp";

interface RsvpListResponse {
  success: boolean;
  message?: string;
  data: RsvpData[];
  summary: RsvpSummary;
}

export const ATTENDANCE_LABEL: Record<Attendance, string> = {
  yes: "Attending",
  no: "Not Attending",
};

export const ATTENDANCE_COLOR: Record<
  Attendance,
  { background: string; foreground: string }
> = {
  yes: { background: "#E5EFE2", foreground: "#4F7047" },
  no: { background: "#F3E7E2", foreground: "#8B5543" },
};

const readRsvpResponse = async <T>(
  res: Response,
  fallbackMessage: string,
): Promise<T> => {
  let data: T & { success?: boolean; message?: string };
  try {
    data = await res.json();
  } catch {
    throw new Error("Unexpected response from server. Please try again.");
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
};

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

export const fetchRsvps = async (): Promise<RsvpListResponse> => {
  const res = await fetch("/api/rsvp", {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await readRsvpResponse<RsvpListResponse>(
    res,
    "Failed to fetch RSVPs.",
  );
  return data;
};

export const editRsvp = async (
  id: string,
  rsvp: RSVPDetails,
): Promise<RsvpData> => {
  const res = await fetch(`/api/rsvp/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(rsvp),
  });
  const data = await readRsvpResponse<{ success: boolean; data: RsvpData }>(
    res,
    "Failed to update RSVP.",
  );
  return data.data;
};

export const deleteRsvp = async (id: string): Promise<void> => {
  const res = await fetch(`/api/rsvp/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  await readRsvpResponse<{ success: boolean }>(res, "Failed to delete RSVP.");
};
