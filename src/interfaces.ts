export interface Review {
  guid: string;
  title: string;
  description: string;
  link: string;
  thumbnailUrl: string;
  spotifyLink?: string;
  publishedDate: Date;
}
