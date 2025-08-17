import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

@Injectable()
export class MediaExtractionService {
  extractMediaFromHtml(html: string): {
    html_payload: string;
    mediaList: string[]; // img or video tag only
    linkList: string[];  // just pasted links
  } {
    const $ = cheerio.load(html);
    const mediaList: string[] = [];
    const linkList: string[] = [];

    // 1. Collect <img> and <video><source> as mediaList
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src) mediaList.push(src);
    });

    $('video source').each((_, el) => {
      const src = $(el).attr('src');
      if (src) mediaList.push(src);
    });

    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        // Skip if it's already used in an <img> or <video>
        const isAlreadyMedia = mediaList.includes(href);
        if (!isAlreadyMedia) {
          linkList.push(href);
        }
      }
    });

    $('iframe').each((_, el) => {
      const src = $(el).attr('src');
      if (src && (src.includes('youtube.com') || src.includes('vimeo.com'))) {
        linkList.push(src); // not a real uploaded video, just embedded
      }
    });

    return {
      html_payload: $.html(),
      mediaList,
      linkList,
    };
  }
}
