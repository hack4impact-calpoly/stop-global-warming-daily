// Sign-Up(onboarding) Type
export type UserFormData = {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;

  birthday?: Date;
  locationName?: string;
  locationCoordinates?: number[];

  interests?: string[];
  focuses?: string[];

  picture?: string;
};
