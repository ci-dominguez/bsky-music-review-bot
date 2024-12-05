export interface Review {
  id?: number;
  guid: string;
  title: string;
  description: string;
  link: string;
  category: 'Track' | 'Album';
  thumbnailUrl: string;
  spotifyLink?: string;
  publishedDate: Date;
  isPosted: boolean;
}

export interface SpotifyTokens {
  id: number;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}
