type ProfileEntity = {
  id: number;
  login: string;
  shortInfo: string;
  subscribed: boolean;
};

type Subscription = {
  id: number;
  login: string;
};

type MyProfileEntity = {
  login: string;
  shortInfo: string;
  subscriptions: Subscription[];
};

type EditProfileEntity = {
  password: string;
  shortInfo: string;
};

export type { ProfileEntity, EditProfileEntity, MyProfileEntity, Subscription };
