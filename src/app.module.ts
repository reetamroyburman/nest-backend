import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { UserService } from './modules/user/user.service';
import { UserController } from './modules/user/user.controller';
import { UrlModule } from './modules/url/url.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [UserModule, UrlModule, MailModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
