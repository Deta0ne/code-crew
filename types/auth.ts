export type OAuthUserMetadata = {
    id: string;
    email: string;
    name?: string;
    picture?: string;
    username?: string; // GitHub username
    github_url?: string;
  }