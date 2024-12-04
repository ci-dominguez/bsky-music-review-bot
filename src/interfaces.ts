export interface Review {
  guid: string;
  title: string;
  description: string;
  link: string;
  category: 'Track' | 'Album';
  thumbnailUrl: string;
  spotifyLink?: string;
  publishedDate: Date;
}

export interface SpotifyTokens {
  id: number;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}
