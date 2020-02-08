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
}
