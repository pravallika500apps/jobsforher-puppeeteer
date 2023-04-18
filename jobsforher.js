const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function start() {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: false,
        userDataDir: "./tmp"
    });
    const page = await browser.newPage();

    await page.goto('https://www.jobsforher.com/jobs');
    await page.screenshot({ path: 'jobsforher.png' });

    const dataHandles = await page.$$('.card-body');
    const data = [];

    for (const datahandle of dataHandles) {
        try {
            const title = await page.evaluate(el => el.innerText, datahandle);
            data.push({ title: title });

        } catch (error) { }
    }

    const csvWriter = createCsvWriter({
        path: 'jobsforher.csv',
        header: [
            { id: 'title', title: 'Title' },
        ]
    });

    await csvWriter.writeRecords(data);
    console.log('CSV file written successfully');

    await browser.close();
}

start();
