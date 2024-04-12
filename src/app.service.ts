import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import puppeteer from 'puppeteer';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async autoScrape() {

    try{
      const date = new Date()
      const datePath = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      const dirExists = existsSync(__dirname + `/../src/uploads/${datePath}`)
      if(!dirExists) mkdirSync(__dirname + `/../src/uploads/${datePath}`)

      const browser = await puppeteer.launch({
        headless: false
      })

      const page = await browser.newPage()

      await page.goto("https://www.bbc.com/", {
        timeout: 2 * 60 * 60 * 1000,
        waitUntil: "networkidle2"
      })
      
      const divs = await page.$$eval("[data-testid='card-headline']", options => {
        return options.map(option => option[0].href)
      })
      console.log(divs)
      // await page.screenshot({path: `./src/uploads/${datePath}/${date.getTime()}.jpg`})
      
      await page.goto("https://www.aljazeera.com/", {
        timeout: 2 * 60 * 60 * 1000,
        waitUntil: "networkidle2"
      })

      await browser.close()
      const data = await this.prisma.headlines.findMany()
      console.log(data)
      return data
    } catch(err){
      console.log("An error Occured", err)
      // this.autoScrape()
      return "An error Occured"
    }
  }
}
