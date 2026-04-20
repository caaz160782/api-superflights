import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/user/dto/user.dto';
import { LocalAuthGuard } from './guards/local-auth.guards';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async sigIn(@Req() req) {
    return await this.authService.signIgn(req.user);
  }

  @Post('signup')
  async sigUp(@Body() userDto: UserDTO) {
    return await this.authService.signUp(userDto);
  }
}
