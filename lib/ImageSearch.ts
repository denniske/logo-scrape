import cheerio = require('cheerio');
import { Helpers } from './Helpers';
import { HtmlLoader, HtmlResponse } from './HtmlLoader';
import * as Url from 'url';

export interface ImageData {
    type: string;
    size?: string;
    url: string;
}

interface IImage {
    url: string;
}

function makeUrl(response: HtmlResponse, image: IImage) {
    const url = Url.parse(response.url);

    // console.log(url);
    // console.log(image);

    if (image.url.startsWith('//')) {
        return url.protocol + '' + image.url;
    }

    if (image.url.startsWith('/')) {
        return url.protocol + '//' + url.host + image.url;
    }

    return response.url + image.url;
}

export class ImageSearch {
    public static async findImages(url: string, showAllImages?: boolean): Promise<ImageData | ImageData[]> {
        const response = await HtmlLoader.getHTML(url);
        const $ = cheerio.load(response.html);

        const logos: string[] = [
            { type: 'og:logo', url: $('meta[property="og:logo"]').attr('content') },
            { type: 'meta-itemprop/logo', url: $('meta[itemprop="logo"]').attr('content') },
            ...$('link[rel*="icon"]')
                .map((i, el) => {
                    return { type: 'link-rel/icon', url: $(el).attr('href'), size: $(el).attr('sizes') };
                })
                .get(),
            { type: 'img-itemprop/logo', url: $('img[itemprop="logo"]').attr('src') },
            {
                type: 'meta-name/msapplication-TileImage',
                url: $('meta[name*="msapplication-TileImage"]').attr('content'),
            },
            { type: 'meta-content/logo', url: $('meta[content*="logo"]').attr('content') },
            { type: 'meta-content/image', url: $('meta[itemprop*="image"]').attr('content') },
            ...$('script[type*="application/ld+json"]')
                .map((i, el) => {
                    return { type: 'json-ld-logo', url: Helpers.findJsonLdImages($(el).html()) };
                })
                .get(),
            { type: 'img-alt/logo', url: $('img[alt*="logo"]').attr('src') },
            { type: 'img-alt/logo-class', url: $('img[class*="logo"]').attr('src') },
            { type: 'img-src/logo', url: $('img[src*="logo"]').attr('src') },
            { type: 'og:image', url: $('meta[property="og:image"]').attr('content') },
            { type: 'svg:image', data: true, url: Helpers.svgToDataURL($('a[class*="logo"]').html()) },
        ].filter(e => e.url);

        const correctLogos: ImageData[] = logos.map((image: any) => {
            return !Helpers.validUrl(image.url) && image.url.indexOf('data:') === -1
                ? {
                      ...image,
                      url: makeUrl(response, image),
                  }
                : image;
        });

        if (showAllImages) {
            return correctLogos;
        } else {
            const [logo] = correctLogos;
            return logo;
        }
    }
}
