type AuthResponse = {
  token: string;
};

type LoginFields = {
  login: string;
  password: string;
};

type RegisterFields = LoginFields & {
  repeatPassword: string;
  shortInfo: string;
};

export type { AuthResponse, LoginFields, RegisterFields };
