import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { LoginModalService } from 'app/core/login/login-modal.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { ApplicationUsersService } from 'app/entities/application-users/application-users.service';
import { takeUntil } from 'rxjs/operators';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IApplicationUsers } from 'app/shared/model/application-users.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;
  user!: IUser;
  appUser!: IApplicationUsers;
  private ngUnsubscribe = new Subject();

  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    protected applicationUsersService: ApplicationUsersService,
    protected userService: UserService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(account => {
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
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginModalService.open();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
