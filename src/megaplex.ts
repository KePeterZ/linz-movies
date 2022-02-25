import puppeteer, { Puppeteer } from "puppeteer"
import { Movie } from "."

const getDate = async(date: string) => {
    const instance = await puppeteer.launch({
        headless: true
    })

    const page = await instance.newPage()

    // Go to page
    await page.goto("https://www.megaplex.at/kinoprogramm/linz", {
        waitUntil: "networkidle2"
    })

    // Open date
    await page.evaluate((date) => {
        // Find the correct date
        const dates = Array.from(document.querySelector("[name='ctl00$Content_MainLeft$DDL_Datum']")?.children as HTMLCollection);

        // Select it
        (dates.find((e: any) => (e.value == date)) as any).selected = true;

        // Run updater
        ;(document.querySelector("[name='ctl00$Content_MainLeft$DDL_Datum']") as any).onchange()
    }, date)

    // Wait until loaded
    await page.waitForNetworkIdle()
    await page.waitForTimeout(3000)

    // Get movies
    const movies = await page.evaluate(() => {
        const movies: Movie[] = []

        Array.from(document.querySelectorAll(".list-mitte")).forEach(e => {
            const timesElement = e.querySelector(".zeit")

            // Get first row
            const times = Array.from(timesElement?.querySelector("tr")?.querySelectorAll("td > a") as NodeListOf<Element>)

            times.forEach((time) => {
                movies.push({
                    name: e.querySelector("h2")?.textContent?.trim(),
                    time: time.textContent?.trim(),
                    cinema: "MegaPlex"
                })
            })
        
        })

        return movies
    })

    await instance.close()
    return movies
}

// 2022-03-03
export default getDate