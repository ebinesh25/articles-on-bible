export interface Page {
  id: string;
  title: {
    tamil: string;
    english: string;
  };
  theme: string;
  content: {
    tamil: {
      mainText: string;
      scripture?: string;
      scriptureReflection?: string;
      promise?: string;
      reflection: string;
      habitDefinition?: string;
      encouragement?: string;
      consistency?: string;
      importance?: string;
      comfort?: string;
      loveDescription?: string;
    };
    english: {
      mainText: string;
      scripture?: string;
      scriptureReflection?: string;
      promise?: string;
      reflection: string;
      habitDefinition?: string;
      encouragement?: string;
      consistency?: string;
      importance?: string;
      comfort?: string;
      loveDescription?: string;
    };
  };
}

export interface ContentData {
  pages: Page[];
  author: {
    tamil: string;
    english: string;
  };
}

export type Language = 'tamil' | 'english';
