import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable, from } from 'rxjs';
import { ApiService } from "../data/api.service";

export interface ISignInCredentials {
  email: string;
  password: string;
}

export interface ICreateCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface IPasswordReset {
  code: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: any;
  isLoggedIn: boolean

  constructor(private afAuth: AngularFireAuth, private ApiService: ApiService) {
    this.isLoggedIn = false;
  }
  Login(email: string, password: string) {
    let data = {
      username: email,
      password: password
    }
    // this.ApiService.adminLogin(data).subscribe(
    //   (result) => {
    //     console.log(result);
    //     return;
    //     (error) => {
    //       console.log(error);
      //   }
      // })
  }

  signIn(credentials: ISignInCredentials): Observable<auth.UserCredential> {
    return from(this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password));
  }

  signOut() {
    return from(this.afAuth.auth.signOut());
  }

  register(credentials: ICreateCredentials) {
    return from(
      this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(
        () => {
          this.afAuth.auth.currentUser.updateProfile({ displayName: credentials.displayName });
          this.afAuth.auth.updateCurrentUser(this.afAuth.auth.currentUser);
        }
      )
    );
  }

  sendPasswordEmail(email) {
    return from(this.afAuth.auth.sendPasswordResetEmail(email));
  }

  resetPassword(credentials: IPasswordReset) {
    return from(this.afAuth.auth.confirmPasswordReset(credentials.code, credentials.newPassword));
  }

  get user(): firebase.User {
    return this.afAuth.auth.currentUser;
  }

}
