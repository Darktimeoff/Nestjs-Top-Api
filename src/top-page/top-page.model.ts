export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

export class TopPageModel {
  _id: string;
  firstLevelCategory: TopLevelCategory;
  secondCategory: string;
  category: string;
  hh?: {
    count: number;
    juniorSalary: number;
    middleSalary: number;
    seniorSalary: number;
  };
  advantages: {
    title: string;
    description: string;
  }[];
  seoText: string;
  tags: string[];
  tagsTitle: string;
}
