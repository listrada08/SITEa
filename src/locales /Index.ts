
import { ptBR } from './pt-BR';
import { enUS } from './en-US';
import { esES } from './es-ES';

export const translations = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': esES
};

export type TranslationKey = keyof typeof ptBR;
export type Language = keyof typeof translations;
