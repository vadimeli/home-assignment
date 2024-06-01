export type PostData = {
  id: number;
  userId: number;
  content: string;
  date: string;
  imageUrl?: string;
  like?: {userId: number, name: string}[]
};

export type UserData = {
  id: number;
  name: string;
  avatar?: string;
};
