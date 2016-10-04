import { Component, Output, EventEmitter } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { LoadingController } from 'ionic-angular';

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

    constructor(public angularFire: AngularFire, public loadingController: LoadingController) {

    }

    login(username: string, password: string) {
        this.isLogging = true;
        let loader = this.loadingController.create({
            content: "Login..."
        });
        loader.present()

        this.angularFire.auth.login({ email: username + "@mail.mail", password: password })
            .then(_ => {
                this.userLogged.emit(true);
                loader.dismiss()
            })
            .catch(_ => {
                loader.dismiss()
                this.isLogging = false;
                this.messageError = "Il y a eu une erreur lors de l'authentification. Veuillez rééssayer !"
            });
    }

}
