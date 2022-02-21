import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/role/role.entity';
import { RoleService } from 'src/role/role.service';
import { User } from 'src/user/models/user.enitity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService
    ) {

  }
  async canActivate(context: ExecutionContext) {
    const access = this.reflector.get<String>('access', context.getHandler());

    // dapetin aksesnya dulu
    if(!access) {
      return true;
    }

    // dapetin authenticated user
    const request = context.switchToHttp().getRequest();

    // dapetin id user
    const id = await this.authService.userId(request);

    // dapetin usernya
    const user: User = await this.userService.findOne({id}, ['role']);

    // dapetin role-nya
    const role: Role = await this.roleService.findOne({id: user.role.id}, ['permissions']);

    if (request.method === 'GET') {

      // cek apakah user punya akses seperti view_users, edit_users, dll
      return role.permissions.some(p => (p.name === `view_${access}`) || (p.name === `edit_${access}`));
    }

    // cek apakah role-nya mempunyai akses, misalkan punya permission id-nya 4, untuk akses get users harus punya permission id 1
    // nanti bakal forbidden resource kalau gapunya permission id-nya
    return role.permissions.some(p => p.name == access);
  }
}
