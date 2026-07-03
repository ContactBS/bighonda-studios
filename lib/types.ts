export type LinkItem = {
  label: string;
  url: string;
};

export type Book = {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  status: string;
  year: string;
  featured: boolean;
  displayOrder: number;
  coverImage: string;
  genre: string;
  format: string;
  description: string;
  highlight: string;
  topics: string[];
  purchaseLinks: LinkItem[];
  related?: {
    podcast?: string;
    events?: string;
  };
};

export type Photo = {
  slug: string;
  title: string;
  location: string;
  year: string;
  description: string;
  image: string;
  alt: string;
  category: string;
  tags: string[];
  availability: string;
  price: string;
  printSizes: string[];
  purchaseUrl: string;
  licenseInquiryUrl: string;
  featured: boolean;
};

export type TeachingVideo = {
  slug: string;
  title: string;
  description: string;
  videoUrl: string;
  externalVideoUrl?: string;
  thumbnailUrl: string;
  date: string;
  category: string;
  tags: string[];
  duration: string;
  featured: boolean;
  visibility: string;
};

export type Service = {
  title: string;
  shortDescription: string;
  idealAudience: string;
  topics: string[];
  format: string;
  duration: string;
  bookingCta: string;
};

export type Episode = {
  title: string;
  date: string;
  description: string;
  url: string;
  audioUrl?: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};
