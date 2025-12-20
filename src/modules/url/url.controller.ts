import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express'
import { UrlService } from './url.service';
import { CreateShortUrlDto } from './infrastructure/dto/short-url.dto';

@Controller('url')
export class UrlController {
    constructor (private readonly urlService: UrlService) {}

    // CREATE SHORT URL
    @Post('shorten')
    async shorten(@Body() req: CreateShortUrlDto) {
    return this.urlService.createShortUrl(req.url);
    }


    // REDIRECT
    @Get(':code')
    async redirect(
    @Param('code') code: string,
    @Res() res: Response,
    ) {

      try {
        const url = await this.urlService.findByCode(code);
      if (!url) {
        return res.status(404).json({ message: 'URL not found' });
      }

      let originalUrl = url.getDataValue('original_url')

      if (!/^https?:\/\//i.test(originalUrl)) {
      originalUrl = `https://${originalUrl}`
      }

      return res.redirect(302, originalUrl)
      } catch (error) {
      console.log(error)
      }

    }


}
