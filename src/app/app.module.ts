import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import 'rxjs/add/operator/take'

import { HomePage } from '../pages/home/home';
import { LoginComponent } from '../pages/home/login/login.component';
import { GlobalScoreComponent } from '../pages/home/globalScore/globalScore.component';
import { ScoreComponent } from '../pages/home/score/score.component';

import { AngularFireModule, AuthMethods, AuthProviders } from 'angularfire2';

export const firebaseConfig = {
  apiKey: 'AIzaSyBI-VOGOo3I9BVRSrYsMT0DappP0p-IVuI',
  authDomain: 'sportcount-645c4.firebaseapp.com',
  databaseURL: 'https://sportcount-645c4.firebaseio.com',
  storageBucket: 'sportcount-645c4.appspot.com',
  messagingSenderId: "905266853625"
};

export const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginComponent,
    GlobalScoreComponent,
    ScoreComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: []
})
export class AppModule {}
