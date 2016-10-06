import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  currentUserId: any = undefined;
  friends: any[] = [];

  constructor(public navCtrl: NavController, public angularFire: AngularFire) {

  }

  userLogged(uid: string) {
    console.log('logged', uid)
    this.currentUserId = uid;
    this.angularFire.auth.take(1).subscribe(user => console.log(user))
    this.angularFire.database.list('/users/' + this.currentUserId + '/friends').take(1).subscribe(friends => {
      this.friends = friends.map(friend => friend.$value)
      console.log(this.friends)
    })
  }

  userLoggedOut(test) {
    this.currentUserId = undefined;
    this.friends = [];
  }
}
