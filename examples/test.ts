import { LogoScrape } from 'logo-scrape';

// (async () => {
//     const url = 'http://producthunt.com';
//     const logo = await LogoScrape.getLogo(url);
//     const logos = await LogoScrape.getLogos(url);
//     console.log({logo, logos});
// })();

(async () => {
    const url = 'https://nodejs.org';
    // const logo = await LogoScrape.getLogo(url);
    const logos = await LogoScrape.getLogos(url);
    console.log(logos);
})();
