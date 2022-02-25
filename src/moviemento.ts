import jsdom from "jsdom"
import { Movie } from ".";

const convertDate = (date: string) => {
    const unswapped = date.split("-")
    return `${unswapped[2]}-${unswapped[1]}-${unswapped[0]}`
    
}

const getDate = async(date: string) => { // For example: 02-02-2022
    date = convertDate(date)
    
    // Declare movies
    let movies: Movie[] = []
    
    // Download movie page
    const page = await jsdom.JSDOM.fromURL(`https://www.moviemento.at/?site=program&date=${date}`)

    // Get two columns
    ;(page.window.document.querySelectorAll(".dailyProgramColumn").forEach((column, index) => {
        // Get cinema name
        const cinema = column.querySelector("h2")?.innerHTML as string

        // Get Movies and loop over them 
        const moviesInCinema = column.querySelectorAll(".dailyProgramMovieBox")
        moviesInCinema.forEach(movie => {
            const movieInfo: Movie = {
                cinema,
                date,
                name: (movie.querySelector(".dailyProgramContentMovie")?.innerHTML as string).trim(),
                language: (movie.querySelector("abbr")?.innerHTML) as string,
                length: (movie.querySelector(".dailyProgramContent")?.textContent)?.split(", ").map(e => e.trimStart().trimEnd()).slice(-1)[0],
                time: movie.querySelector(".dailyProgramTime")?.textContent as string
            }

            movies.push(movieInfo)
        })
    }))

    return movies
}

// 02-02-2022
export default getDate