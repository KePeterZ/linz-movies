import Moviemento from "./moviemento"
import Cineplexx from "./cineplexx"
import Megaplex from "./megaplex"

import { generate } from "text-to-image"
import fs from "fs"

export interface Movie {
    cinema?: string;
    name?: string;
    language?: string;
    date?: string;
    time?: string;
    times?: string[];
    length?: string;
    extra?: any
}

const compressMovies = (movies: Movie[]) => {
    const compressedMovies: Movie[] = []
    
    for(let movie of movies) {
        if(!compressedMovies.map(e => [e.name, e.cinema].toString()).includes([movie.name, movie.cinema].toString())) {
            movie.times = []
            movie.times.push(movie.time as string)
            movie.time = undefined

            compressedMovies.push(movie)
        } else {
            // Find index of movie
            let indexOfMovie = 0;
            compressedMovies.map(e => [e.name, e.cinema].toString()).forEach((e, i) => {
                if(e == [movie.name, movie.cinema].toString()) {
                    indexOfMovie = i
                }
            })

            compressedMovies[indexOfMovie].times?.push(movie.time as string)
        }
    }

    return compressedMovies.map(movie => {
        return [
            `Name: ${movie.name}`,
            `Cinema: ${movie.cinema}`,
            `Times: ${movie.times?.join(", ")}`
        ].join("\n")
    }).join("\n\n")
}

const createImage = async(text: string, date: string) => {
    return await generate(`Movies on the date ${date}\n\n${text}`, {
        fontSize: 12,
        lineHeight: 20
    })
}

export const dateToPNG = async(date: string) => {
    const movies = (await Promise.all([
        Moviemento(date).catch(err => { console.log(err); return [] }),
        Cineplexx(date).catch(err => { console.log(err); return [] }),
        Megaplex(date).catch(err => { console.log(err); return [] }),
    ])).flat()

    return createImage(compressMovies(movies), date)
}

const main = async() => {
    const date = "2022-03-04"

    let movies = (await Promise.all([
        Moviemento(date),
        Cineplexx(date),
        Megaplex(date)
    ])).flat()

    fs.writeFileSync("debug.txt", JSON.stringify(movies, null, 2))

    console.log(await createImage(compressMovies(movies), date))
}

// dateToPNG("2022-03-04").then(png => console.log(png))