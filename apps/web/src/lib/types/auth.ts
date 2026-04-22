export interface LoginInput {
  email: string;
  password: string;
  turnstileToken: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  turnstileToken: string;
}

export interface AuthScaffoldResponse {
  status: string;
  message: string;
}
