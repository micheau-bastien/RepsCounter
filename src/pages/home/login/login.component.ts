import { Component, Output, EventEmitter } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { LoadingController, AlertController } from 'ionic-angular';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
})
export class LoginComponent {
    @Output() userLogged = new EventEmitter();

    messageError: string = undefined;
    isLogging: boolean = false;
    log: string = '';
    pwd: string = '';

    constructor(public angularFire: AngularFire, public loadingController: LoadingController, public alertController: AlertController) {

    }

    login(username: string, password: string) {
        this.isLogging = true;
        let loader = this.loadingController.create({
            content: "Login..."
        });
        loader.present()

        this.angularFire.auth.login({ email: username + "@mail.mail", password: password })
            .then(user => {
                loader.dismiss()
                this.userLogged.emit(user.uid);
            })
            .catch(_ => {
                loader.dismiss()
                this.isLogging = false;
                this.messageError = "Il y a eu une erreur lors de l'authentification. Veuillez rééssayer !"
            });
    }

    showsSignupAlert() {
        let prompt = this.alertController.create({
            title: 'Inscription',
            message: "Entrez vos données d'inscription. ",
            inputs: [
                {
                    name: 'login',
                    placeholder: 'Login'
                },
                {
                    name: 'password',
                    placeholder: 'Mot de passe',
                    type: 'password'
                },
            ],
            buttons: [
                {
                    text: 'Annuler',
                    handler: data => {
                    }
                },
                {
                    text: "S'inscrire",
                    handler: data => {
                        this.signup(data.login, data.password);
                    }
                }
            ]
        });
        prompt.present();
    }

    signup(login, password) {
        let loader = this.loadingController.create({
            content: "Inscription..."
        });
        loader.present();
        this.angularFire.auth.createUser({
            email: login + '@mail.mail',
            password: password
        })
            .then(_ => {
                this.angularFire.auth.take(1).subscribe(udata => {
                    this.angularFire.database.object('users/' + udata.auth.uid).set({
                        name: login,
                        scoreTotal: 0,
                        messages: {
                            0: { RepsCounter: "On démarre l'entrainement ! 💪" }
                        }
                    }).then(_ => {
                        loader.dismiss();
                        this.userLogged.emit(true);
                    })
                    udata.auth.updateProfile({
                        displayName: login,
                        photoURL: ""
                    })
                })
            })
            .catch(error => {
                this.messageError = error.message;
                loader.dismiss();
            })
    }

}
