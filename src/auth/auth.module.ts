import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { LoginAuthProvider } from './providers/login-auth.provider';
import { UserModule } from 'src/user/user.module';
import { SignupProvider } from './providers/signup.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/user/users.entity';
import { AuthController } from './auth.controller';
import { GenerateJwtProvider } from './providers/generate-jwt.provider';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { OwnerOrAdminGuard } from './guards/owner-admin.guard';
import { EmailsModule } from 'src/emails/emails.module';
import { VerifyUserEmailProvider } from './providers/verify-user-email.provider';
@Module({
  providers: [
    AuthService,
    { provide: HashingProvider, useClass: BcryptProvider },
    LoginAuthProvider,
    SignupProvider,
    GenerateJwtProvider,
    OwnerOrAdminGuard,
    VerifyUserEmailProvider,
  ],
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([Users]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    EmailsModule,
  ],
  controllers: [AuthController],
  exports: [GenerateJwtProvider, HashingProvider, OwnerOrAdminGuard],
})
export class AuthModule {}
