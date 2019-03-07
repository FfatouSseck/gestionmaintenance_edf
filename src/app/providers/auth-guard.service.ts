import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private router: Router,public auth: AuthenticationService) {

    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        return this.auth.isAuthenticated();
    }

}
