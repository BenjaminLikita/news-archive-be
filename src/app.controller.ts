import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron, Interval } from '@nestjs/schedule';
import { Response } from 'express';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  // @Interval(15000)
  // @Cron("*/2 * * * *")
  @Post("scrape")
  async autoScrape(@Body() body: any){
    return this.appService.autoScrape()
  }

  @Get("image/:src")
  getImage(@Param() src: string, @Res() res: Response){
    return res.sendFile(`/src/uploads/2024-4-11/1712830635156.jpg`, { root: "." })
  }
  @Get("image/:date/:imageName")
  getImagee(@Param() param: {date: string, imageName: string}, @Res() res: Response){
    return res.sendFile(`/src/uploads/${param.date}/${param.imageName}`, { root: "." })
  }

  @Get("/headlines/:date")
  getHeadlines(@Param() param: {date: string}){
    return this.appService.getHeadlines(param)
  }
}
