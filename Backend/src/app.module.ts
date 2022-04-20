import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SocketsModule } from './sockets/sockets.module'

@Module({
  imports: [
    SocketsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'client'),
      exclude: ['/api*'],
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
