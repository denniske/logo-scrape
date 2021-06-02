import { LogoScrape } from './LogoScrape';

(async () => {
    const url = 'https://desktop.github.com/';
    // const logo = await LogoScrape.getLogo(url);
    const logos = await LogoScrape.getLogos(url);
    console.log(logos);
})();

// (async () => {
//     const url = 'https://nodejs.org';
//     // const logo = await LogoScrape.getLogo(url);
//     const logos = await LogoScrape.getLogos(url);
//     console.log(logos);
// })();
