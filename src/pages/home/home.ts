import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isLogged: boolean = false;
  currentUserData: any = undefined
  friends: any[] = [];
  friendsInitialized: boolean = false

  constructor(public navCtrl: NavController, public angularFire: AngularFire) {

  }

  userLogged(test) {
    this.angularFire.auth.subscribe(user => {
      this.isLogged = true;
      var currentUserDataPromise = this.angularFire.database.object('/users/' + user.uid)
      currentUserDataPromise.subscribe(udata => {
        this.currentUserData = udata
      })
      if (!this.friendsInitialized) {
        this.friendsInitialized = true;
        currentUserDataPromise.take(1).subscribe(data => {
          console.log('take1', data);
          Object.keys(data.friends).forEach(key => {
            console.log('foreachfriend', data);
            this.angularFire.database.object('/users/' + data.friends[key]).take(1).subscribe(friend => {
              console.log('friendaddad', friend);
              this.friends.push(friend);
            })
          })
        })
      }
    })
  }

  userLoggedOut(test) {
    this.isLogged = false;
    console.log('logout', this.isLogged)
    this.friends = [];
  }
}
