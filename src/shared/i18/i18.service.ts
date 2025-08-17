import { Injectable } from '@nestjs/common';
import * as en from './en/common.json';
import * as kr from './kr/common.json';

const translations = {
  en,
  kr,
};

@Injectable()
export class I18nService {
  translate(rawKey: string, lang: string = 'en', params: Record<string, any> = {}): any {
    if (Array.isArray(rawKey)) {
      // Recursively translate each key in the array
      return rawKey.map((key) => this.translate(key, lang, params));
    }
    if (typeof rawKey !== 'string') {
      console.warn('[I18nService] Non-string key passed to translate():', rawKey);
      return '';
    }

    const dict = translations[lang] || translations['en'];
    const keys = rawKey.split('.');
    let message: any = dict;

    for (const k of keys) {
      message = message?.[k];
      if (message === undefined) break;
    }

    if (typeof message !== 'string') {
      return rawKey; // fallback to key if translation is missing
    }

    // Interpolate {{param}} placeholders
    return message.replace(/{{(.*?)}}/g, (_, param) => {
      const value = params[param.trim()];
      return value !== undefined ? value : '';
    });
  }
}
