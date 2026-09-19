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

export interface DietaryOption {
  id: string;
  label: string;
}
