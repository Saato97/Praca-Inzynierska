import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';

import { VERSION } from 'app/app.constants';
import { LANGUAGES } from 'app/core/language/language.constants';
import { AccountService } from 'app/core/auth/account.service';
import { LoginModalService } from 'app/core/login/login-modal.service';
import { LoginService } from 'app/core/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { Authority } from 'app/shared/constants/authority.constants';
import { Account } from 'app/core/user/account.model';
import { Subject, Subscription } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { ApplicationUsersService } from 'app/entities/application-users/application-users.service';
import { takeUntil } from 'rxjs/operators';
import { IUser } from 'app/core/user/user.model';
import { IApplicationUsers } from 'app/shared/model/application-users.model';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['navbar.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  swaggerEnabled?: boolean;
  version: string;
  account: Account | null = null;
  authSubscription?: Subscription;
  user!: IUser;
  appUser!: IApplicationUsers;
  private ngUnsubscribe = new Subject();

  constructor(
    private loginService: LoginService,
    private languageService: JhiLanguageService,
    private sessionStorage: SessionStorageService,
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private profileService: ProfileService,
    protected applicationUsersService: ApplicationUsersService,
    protected userService: UserService,
    private router: Router
  ) {
    this.version = VERSION ? (VERSION.toLowerCase().startsWith('v') ? VERSION : 'v' + VERSION) : '';
  }

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      if (account) {
        this.userService
          .find(account.login)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(user => {
            this.user = user;
            this.applicationUsersService
              .find(this.user.id)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(res => {
                if (res.body) {
                  this.appUser = res.body;
                }
              });
          });
      }
    });

    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.swaggerEnabled = profileInfo.swaggerEnabled;
    });
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorage.store('locale', languageKey);
    this.languageService.changeLanguage(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.accountService.hasAnyAuthority(Authority.ADMIN);
  }

  login(): void {
    this.loginModalService.open();
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  getImageUrl(): string {
    return this.isAuthenticated() ? this.accountService.getImageUrl() : '';
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
