// region Our Story
export interface StoryNode {
  year: string;
  title: string;
  body: string;
  imgSrc: string;
  imgAlt: string;
  imgAspectRatio?: string;
}

export interface GallerySlot {
  tall?: boolean;
  wide?: boolean;
  delay: number;
  imgSrc?: string;
  alt?: string;
  folder?: string;
}

// endregion
