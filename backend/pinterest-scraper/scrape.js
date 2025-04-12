const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Trend-related search terms
    const queries = [
        'outfit ideas',
        '2025 fashion trends',
        'spring fashion 2025',
        'summer outfits',
        'street style',
        'ootd2025',
        'newfashion',
        'stylish'
    ];

    for (const query of queries) {
        const url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
        console.log(`🔍 Scraping: ${query}`);
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('img');

        const imageLinks = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('img'));
            return images
                .map(img => img.src.replace('/60x60/', '/originals/'))
                .filter(src => src.includes('pinimg.com'));
        });

        const top10 = imageLinks.slice(0, 10);

        for (const image of top10) {
            try {
                const res = await axios.post('http://localhost:4000/api/items', {
                    image,
                    type: 'trend', // 💡 Add the type here to identify this as a trend image
                    tags: [query.toLowerCase(), 'pinterest', 'trend']
                });
                
                console.log('✅ Uploaded:', res.data.image);
            } catch (err) {
                console.error('❌ Upload failed for:', image);
                console.error('Full error:', err);
            }
        }
    }

    await browser.close();
    console.log("✅ Scraping completed for all queries.");
})();
