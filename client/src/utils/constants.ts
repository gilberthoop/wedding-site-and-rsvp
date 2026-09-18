import { StoryNode } from "./types/home";
import { DietaryOption } from "./types/rsvp";

export const IS_NOTIFICATIONS_ENABLED =
  import.meta.env.VITE_APP_NOTIFICATIONS_ENABLED === "true";

export const IS_RSVP_ENABLED = import.meta.env.VITE_APP_RSVP_ENABLED === "true";

export const CONTACT_EMAIL = "sweetmango0508@gmail.com";

// region Our Story
export const STORY_NODES: StoryNode[] = [
  {
    year: "The Beginning",
    title: "When We First Met",
    body: "Every great love story has a beginning. This is where ours started.",
    imgSrc: "/images/story/first.jpg",
    imgAlt: "Add a photo of when you first met",
  },
  {
    year: "The Proposal",
    title: "He Asked, She Said Yes",
    body: 'The moment William got down on one knee and Sweet said "yes" — a day they\'ll remember forever.',
    imgSrc: "/images/story/yes.jpg",
    imgAlt: "Add an engagement photo",
    imgAspectRatio: "4/3",
  },
  {
    year: "May 8, 2027",
    title: "Forever Begins",
    body: "On this beautiful day in May, William and Sweet will exchange their vows and begin their forever together. We are so grateful you'll be part of this milestone.",
    imgSrc: "/images/story/church.jpg",
    imgAlt: "Add a save the date photo",
  },
];
// endregion

// region RSVP
export const DIETARY_OPTIONS: DietaryOption[] = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "gluten-free", label: "Gluten-Free / Celiac" },
  { id: "dairy-free", label: "Dairy-Free / Lactose Intolerant" },
  { id: "nut-allergy", label: "Nut Allergy (Peanuts / Tree Nuts)" },
  { id: "shellfish", label: "Shellfish / Seafood Allergy" },
  { id: "kids-meal", label: "Kid's Meal (for children)" },
];
// endregion
