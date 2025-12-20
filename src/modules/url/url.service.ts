import { Injectable } from '@nestjs/common';
import { encodeBase62 } from '../../common/utils/base64.util';
import { Url } from './infrastructure/persistence/models/IUrl.model';
import { urlRepository } from './infrastructure/persistence/repositories/url.repo';

@Injectable()
export class UrlService {


  async createShortUrl(originalUrl: string) {
    // 1. Create record
    const url = await urlRepository.create({
      original_url: originalUrl,
    });

    // 2. Generate short code
    const shortCode = encodeBase62(url.getDataValue('id'));

    // 3. Update record
    await urlRepository.updateById(url.getDataValue('id'), {
      short_code: shortCode,
    });

    return {
      shortCode,
      shortUrl: `http://localhost:3000/${shortCode}`,
    };
  }

  async findByCode(code: string) {
    const data = await urlRepository.findByShortCode(code);
    return data
  }
}
