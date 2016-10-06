import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  currentUserId: any = undefined;
  friends: any[] = [];
  login: any = {};
  storage: any = new Storage();

  constructor(public navCtrl: NavController, public angularFire: AngularFire, public loadingController: LoadingController) {

  }

  ngOnInit() {
    //console.log(sessionStorage.getItem("username"), sessionStorage.getItem('password'));
    this.storage.get('userLog')
      .then(login => {
        if (login) {
          let loader = this.loadingController.create({
            content: "Login..."
          });
          loader.present()
          this.angularFire.auth.login({ email: login.username + "@mail.mail", password: login.password })
            .then(user => {
              loader.dismiss()
              this.userLogged(user.uid);
            })
        }
      })
      .catch(_ => console.log('NoLog'));


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
    this.storage.clear();
    this.currentUserId = undefined;
    this.friends = [];
  }
}
