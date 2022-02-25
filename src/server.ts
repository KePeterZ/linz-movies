import express from "express"
import { dateToPNG } from "."

import fs from "fs"

const app = express()

app.get("/movies/:date", async(req, res) => {
    const image = (await dateToPNG(req.params.date)).replace(/^data:image\/png;base64,/, "");
    const path = `/tmp/movies-image-${Math.floor(Math.random()*10000)}.png`
    fs.writeFileSync(path, image, "base64")
    
    res.sendFile(path, () => {
        fs.rmSync(path)
    })
})

app.get("/base64/:date", async(req, res) => {
    const image = await dateToPNG(req.params.date)
    res.send(image)
})

app.listen(3000, () => console.log("3000."))