import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// Deliberately excludes `role` and `password`: role changes go through the
// dedicated admin-only endpoint (PATCH /user/:id/role), and password changes
// go through the auth module so the current password can be verified and the
// new one hashed correctly.
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['role', 'password'] as const),
) {}
