
export interface User {
  uid: string;
  email: string;
  isPaid: boolean;
  generations: number;
}

export type Language = 'en' | 'fr' | 'es' | 'ar';

export interface Recipe {
  title: string;
  ingredients: string[];
  steps: string[];
}

export const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'ar', name: 'العربية' },
];
