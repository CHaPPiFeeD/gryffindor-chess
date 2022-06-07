import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SocketsModule } from '../sockets/sockets.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SocketsModule,
    MongooseModule.forRoot(process.env.DB_URL),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'client'),
      exclude: ['/api*'],
    }),

    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
