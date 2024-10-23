export interface IStoryList {
  _id: string;
  title: string;
  thumbnail: string;
  thumbnailPublicId: string;
  content: string[];
  createdAt: string;
  __v: number;
}

export interface IDate {
  endDate: string;
  startDate: string;
}
