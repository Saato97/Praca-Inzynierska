import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiLanguageService } from 'ng-jhipster';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { LANGUAGES } from 'app/core/language/language.constants';
import { IApplicationUsers } from 'app/shared/model/application-users.model';
import { IUser } from 'app/core/user/user.model';
import { ApplicationUsersService } from 'app/entities/application-users/application-users.service';
import { UserService } from 'app/core/user/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit, OnDestroy {
  account!: Account;
  appUser!: IApplicationUsers;
  user!: IUser;
  success = false;
  languages = LANGUAGES;
  private ngUnsubscribe = new Subject();
  settingsForm = this.fb.group({
    username: [undefined, [Validators.required, Validators.minLength(6)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    langKey: [undefined],
  });

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private languageService: JhiLanguageService,
    private applicationUsersService: ApplicationUsersService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
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
                  this.settingsForm.patchValue({
                    username: this.appUser.username,
                    email: account.email,
                    langKey: account.langKey,
                  });
                }
              });
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  save(): void {
    this.success = false;
    this.appUser.username = this.settingsForm.get('username')!.value;
    this.account.email = this.settingsForm.get('email')!.value;
    this.account.langKey = this.settingsForm.get('langKey')!.value;
    // eslint-disable-next-line no-console
    console.log('AppUser username:' + this.appUser.username);
    this.applicationUsersService.update(this.appUser).subscribe();
    this.accountService.save(this.account).subscribe(() => {
      this.success = true;

      this.accountService.authenticate(this.account);

      if (this.account.langKey !== this.languageService.getCurrentLanguage()) {
        this.languageService.changeLanguage(this.account.langKey);
      }
    });
  }
}
