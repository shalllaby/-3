import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Protects routes with Bearer JWT token */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
