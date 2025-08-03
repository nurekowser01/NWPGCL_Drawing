export interface GithubConfig {
  api: string;
  repo: string;
  token: string;
}

export interface Environment {
  production: boolean;
  enableUpdates: boolean;
  github: GithubConfig | null;
}