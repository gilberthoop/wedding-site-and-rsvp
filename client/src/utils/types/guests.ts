export interface GuestEntry {
  firstname: string;
  lastname: string;
}

export interface GuestData extends GuestEntry {
  _id: string;
  createdAt?: string;
}
