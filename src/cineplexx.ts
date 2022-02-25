import axios from "axios"
import { JSDOM } from "jsdom"
import { Movie } from "."

const getDate = async (date: string) => {
    let movies: Movie[] = []

    const html = await (await axios.get(`https://www.cineplexx.at/service/program.php?type=program&centerId=20&date=${date}&sorting=alpha&undefined=Alle&view=detail&page=1&_=1645791926490`)).data

    const page = new JSDOM(html);

    Array.from(page.window.document.querySelectorAll(".overview-element")).map(movie => {

        Array.from(movie.querySelectorAll(".start-times > .span3")).map(time => {
            const info: Movie = {
                cinema: "Cineplexx",
                date
            }

            info.name = movie.querySelector("h2")?.textContent as string
            info.time = (time.querySelector(".time-desc")?.textContent as string).trim();

            info.language = "Deutsche Synchronfassung"

            ;["OV", "OmU", "OmdU", "OmeU"].forEach(lang => {
                if(time.textContent?.toLowerCase().includes(` ${lang.toLowerCase()}`)) {
                    info.language = lang
                }
            })

            Array.from(movie.querySelectorAll(".starBoxSmall > p")).forEach(p => {
                if(p.textContent?.toLowerCase().includes("minuten")) {
                    info.length = p.textContent.split("|")[1].trim()
                }
            })

            movies.push(info)
        })



    })

    return movies
}

// 2022-02-27
export default getDate