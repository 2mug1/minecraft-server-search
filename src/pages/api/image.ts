import { NextApiRequest, NextApiResponse } from "next";
import chromium from "chrome-aws-lambda"
import fs from 'fs'
import path from 'path'

const chromiumFontSetup = () => {
    if (process.env.HOME == null) process.env.HOME = "/tmp"
    const dest = process.env.HOME + "/.fonts"
    if (!fs.existsSync(dest)) fs.mkdirSync(dest)
    const src = './public/fonts/Noto_Sans_JP'
    for (const font of fs.readdirSync(src)) {
        if (!font.endsWith(".otf")) continue
        if (fs.existsSync(path.join(dest, font))) continue
        fs.copyFileSync(path.join(src, font), path.join(dest, font))
    }
}

const shot = async (host: string) => {
    //chromiumFontSetup()
    const { puppeteer } = chromium
    const agent = await puppeteer.launch({
        args: chromium.args,
        headless: true,
        executablePath: await chromium.executablePath,
        env: {
            ...process.env,
            LANG: "ja_JP.UTF-8"
        }
    })
    const page = await agent.newPage()
    try {
        const selector = '#server'
        await page.goto(`https://motoped.vercel.app/${host}`)
        await page.waitForSelector(selector);            
        const element = await page.$(selector)     
        if(element == null) return await page.close()
        const box = await element.boundingBox()
        if(box == null) return await page.close()
        const { width, height, x, y} = box
        return await page.screenshot({ clip: { width, height, x, y}, type: "png" })
    } finally {
        await page.close()
    }
}


export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("X-Robots-Tag", "noindex")
    const { host } = req.query
    if (typeof host != "string") return res.status(500)
    shot(host).then((img) => {
        res.setHeader("Link", `<${host}>; rel="canonical"`);
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Content-DPR", "2.0");
        res.send(img);
    })
}