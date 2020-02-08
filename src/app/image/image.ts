export interface URLS {
  full: string;
  raw: string;
  regular: string;
  small: string;
  thumb: string;
}

export interface User {
  name: string;
  portfolio_url: string;
  bio: string;
  username: string;
  location: string;
  total_photos: string;
}

export interface Exif {
  make: string;
  model: string;
  exposure_time: number;
  aperture: number;
  focal_length: number;
  iso: number;
}

export interface Location {
  city: string;
  country: string;
}

export interface Image {
  id: string;
  color: string;
  created_at: string;
  urls: URLS;
  links: object;
  description: string;
  user: User;
  portfolio_url: string;
}

export interface Item {
  id: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  downloads: number;
  likes: number;
  description: string;
  exif: Exif;
  location: Location;
  urls: URLS;
  links: object;
  tags: object;
  user: User;
}
