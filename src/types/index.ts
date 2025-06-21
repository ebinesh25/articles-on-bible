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

// New dynamic content structure
export interface ContentEntry {
  type: string;
  value: string;
}

export interface DynamicPage {
  id: string;
  title: {
    tamil: string;
    english: string;
  };
  theme: string;
  content: {
    tamil: ContentEntry[];
    english: ContentEntry[];
  };
}

export interface ContentData {
  pages: Page[];
  author: {
    tamil: string;
    english: string;
  };
}

export interface DynamicContentData {
  pages: DynamicPage[];
  author: {
    tamil: string;
    english: string;
  };
}

export type Language = 'tamil' | 'english';
