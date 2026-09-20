import { StoryNode, GallerySlot } from "./types/home";
import { DietaryOption } from "./types/rsvp";

export const IS_NOTIFICATIONS_ENABLED =
  import.meta.env.VITE_APP_NOTIFICATIONS_ENABLED === "true";

export const IS_RSVP_ENABLED = import.meta.env.VITE_APP_RSVP_ENABLED === "true";

export const CONTACT_EMAIL = "sweetmango0508@gmail.com";

export const NAV_LINKS = [
  { label: "Our Story", href: "#our-story" },
  { label: "Details", href: "#details" },
  { label: "Gallery", href: "#gallery" },
  // { label: 'Wedding Party', href: '#wedding-party' },
];

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

// region Gallery
const galleryImageModules = import.meta.glob<string>(
  "/public/images/gallery/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP,AVIF,GIF}",
  { eager: true, query: "?url", import: "default" },
);

// Rhythm for varied masonry layout cards
const MASONRY_PATTERN: Array<Pick<GallerySlot, "tall" | "wide">> = [
  { tall: true },
  {},
  {},
  { wide: true },
  {},
  { tall: true },
  {},
  {},
  { wide: true },
  {},
  { tall: true },
  {},
];

// Randomize entries using Fisher-Yates shuffle
const randomizedImageEntries = Object.entries(galleryImageModules);
for (let i = randomizedImageEntries.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [randomizedImageEntries[i], randomizedImageEntries[j]] = [
    randomizedImageEntries[j],
    randomizedImageEntries[i],
  ];
}

export const GALLERY_SLOTS: GallerySlot[] = randomizedImageEntries.map(
  ([key, rawSrc], index) => {
    const relPath = key.replace(/^\/public\/images\/gallery\//, "");
    const parts = relPath.split("/");
    const folder = parts.length > 1 ? parts[0] : undefined;
    const fileName = parts[parts.length - 1];
    const layout = MASONRY_PATTERN[index % MASONRY_PATTERN.length];

    const srcString =
      typeof rawSrc === "string"
        ? rawSrc
        : (rawSrc as { default?: string })?.default || key;
    // Strip leading /public if present in dev so browser requests /images/...
    const imgSrc = srcString.replace(/^\/public/, "");

    return {
      ...layout,
      delay: (index % 6) * 50,
      imgSrc,
      alt: `Wedding memory - ${fileName.replace(/\.[^/.]+$/, "")}`,
      folder,
    };
  },
);

// Backward-compatible SLOTS export
export const SLOTS: GallerySlot[] =
  GALLERY_SLOTS.length > 0
    ? GALLERY_SLOTS
    : [
        { tall: true, delay: 0 },
        { delay: 100 },
        { delay: 150 },
        { wide: true, delay: 200 },
        { delay: 250 },
        { tall: true, delay: 300 },
      ];
// endregion
