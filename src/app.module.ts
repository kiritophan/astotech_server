import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { UserAddressesModule } from './modules/user-addresses/user-addresses.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { SocketModule } from './modules/socket/socket.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductOptionsModule } from './modules/product-options/product-options.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DBNAME,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    UserAddressesModule,
    AuthenticationModule,
    SocketModule,
    ProductOptionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }