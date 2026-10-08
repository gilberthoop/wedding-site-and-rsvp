export type FormStatus = "success" | "error" | "info" | "warning";

export interface FormResponse {
  message: string;
  status: FormStatus;
}

export type Attendance = "yes" | "no";

export interface RSVPDetails {
  firstname: string;
  lastname: string;
  email: string;
  attending: Attendance;
  dietaryRestrictions?: string;
  songRequest?: string;
  message?: string;
}

export interface RsvpData extends RSVPDetails {
  _id: string;
  submittedAt: string;
}

export interface RsvpSummary {
  total: number;
  attending: number;
  notAttending: number;
}

export interface DietaryOption {
  id: string;
  label: string;
}
