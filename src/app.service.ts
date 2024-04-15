import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import puppeteer from 'puppeteer';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async autoScrape() {
    
    const date = new Date()
    const datePath = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const dirExists = existsSync(resolve(`./src/uploads/${datePath}`))
    if(!dirExists) mkdirSync(resolve(`./src/uploads/${datePath}`))

      console.log(puppeteer.executablePath())
    const browser = await puppeteer.launch({
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--single-process',
        '--no-zygote'
      ],
      // executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
    })

    try{

      const page = await browser.newPage()

      await page.goto("https://www.bbc.com/news/world/", {
        timeout: 3 * 60 * 1000,
        waitUntil: "networkidle2"
      })
      
      const link = await page.$$eval("a[data-testid='external-anchor']", options => {
        return options.map(option => option.href)
      })
      const text = await page.$$eval("[data-testid='card-headline']", options => {
        return options.map(option => option.textContent)
      })
      
      const imageName = `${date.getTime()}.jpg`
      await page.screenshot({path: resolve(`./src/uploads/${datePath}/${imageName}`)})

      
      
      // await page.goto("https://www.aljazeera.com/", {
      //   timeout: 2 * 60 * 60 * 1000,
      //   waitUntil: "networkidle2"
      // })
      
      
      const data = await this.prisma.headlines.create({
        data: {
          headline: text[0],
          imageUrl: `/${datePath}/${imageName}`,
          url: link.length ? link[0] : "https://www.bbc.com/news/world/"
        }
      })
      
      
      return data
      
    } catch(err){
      console.log("An error Occured", err)
      return "An error Occured"
    } finally {
      await browser.close()
    }
  }

  
  async getHeadlines(param: {date: string}){
    const split = param.date.split("-")
    if(split.length !== 3 || split.includes("")) return "Invalid Date Usage: YYYY/M/D"
    const startDate = new Date(param.date)
    const endDate = new Date(param.date);

    startDate.setHours(1, 0, 0, 0); // Sets time to 00:00:00
    endDate.setHours(24, 59, 59, 999); // Sets time to 23:59:59

    // const headlines = await this.prisma.headlines.findMany()
    const headlines = await this.prisma.headlines.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    })
    return headlines
  }
}
