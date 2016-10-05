import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { NavController, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isLogged: boolean = false;
  currentUserData: any = undefined
  friends: any[] = [];
  friendsInitialized: boolean = false

  constructor(public navCtrl: NavController, public angularFire: AngularFire, public loadingController: LoadingController) {

  }

  userLogged(test) {
    let loaderData = this.loadingController.create({
      content: "Chargement des données..."
    });
    loaderData.present();
    this.angularFire.auth.subscribe(user => {
      if (user) {
        this.isLogged = true;
        console.log('ERR')
        var currentUserDataPromise = this.angularFire.database.object('/users/' + user.uid)
        currentUserDataPromise.subscribe(udata => {
          this.currentUserData = udata
        })
        if (!this.friendsInitialized) {
          this.friendsInitialized = true;
          currentUserDataPromise.take(1).subscribe(data => {
            if (data.friends) {
              Object.keys(data.friends).forEach(key => {
                this.angularFire.database.object('/users/' + data.friends[key]).take(1).subscribe(friend => {
                  this.friends.push(friend);
                })
              })
            }
            loaderData.dismiss();
          })
        }
      }
    })
  }

  userLoggedOut(test) {
    this.isLogged = false;
    this.friends = [];
  }
}
