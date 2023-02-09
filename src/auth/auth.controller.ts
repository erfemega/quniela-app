import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from './dtos/UserLogin.dto';
import { LocalAuthGuard } from './guards/local.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.addUser(createUserDto);
    return user;
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserLoginDto })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/user')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/admin')
  getDashBoard(@Request() req) {
    return req.user;
  }
}
