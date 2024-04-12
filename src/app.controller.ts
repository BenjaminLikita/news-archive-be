import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron, Interval } from '@nestjs/schedule';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Post("puppett")
  async pupe(@Body() body: any){

    const date = new Date()
    const datePath = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    // const browser = await puppeteer.launch()

    // const page = await browser.newPage()

    // await page.goto("https://www.foxnews.com/")
    // await page.goto("https://google.com/")
    // await page.screenshot({path: `./src/uploads/${datepath}/image.jpg`})

    // await browser.close()
    // return this.prisma.headlines.findMany()
    return this.appService.autoScrape()
  }

  // @Interval(15000)
  // @Cron("*/2 * * * *")
  @Post("puppet")
  async puper(@Body() body: any){
  // handleCron() {
    console.log("hello")
    return this.appService.autoScrape()
  }
}
