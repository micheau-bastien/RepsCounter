import { Component, Output, Input, EventEmitter } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { LoadingController, AlertController } from 'ionic-angular';

@Component({
    selector: 'globalscore',
    templateUrl: './globalScore.component.html',
})
export class GlobalScoreComponent {

    @Input() userid: any;
    @Output() userLoggedOut = new EventEmitter();

    globalScoreSub: any = undefined;
    globalScore: number = undefined;
    message: any[] = undefined;
    messageSub: any = undefined;

    constructor(public angularFire: AngularFire, public loadingController: LoadingController, public alertController: AlertController) { }

    onInit() {
    }

    ngOnInit() {
        let loader = this.loadingController.create({
            content: "Chargement des données"
        });
        loader.present()
        console.log('bb', this.userid)
        this.globalScoreSub = this.angularFire.database.object('/users/' + this.userid + '/scoreTotal').subscribe(scoreTotal => {
            this.globalScore = scoreTotal.$value
            if(this.messageSub) this.messageSub.unsubscribe();
            this.messageSub = this.angularFire.database.list('/users/' + this.userid + '/messages', {
                query: {
                    orderByKey: true,
                    endAt: this.globalScore.toString()
                }
            }).subscribe(messages => {
                if (messages[messages.length - 1]) {
                    var messagesLocal = []
                    Object.keys(messages[messages.length - 1]).forEach(key => {
                        if (key != '$key' && key != '$exists') {
                            messagesLocal.push({ author: key, message: messages[messages.length - 1][key] })
                        }
                    })
                    this.message = messagesLocal
                    loader.dismiss()
                }
            })
        });
    }

    logout() {
        this.globalScoreSub.unsubscribe();
        this.messageSub.unsubscribe();
        //this.angularFire.auth.logout();
        this.userLoggedOut.emit(false);
    }

    showsAddFriendAlert() {
        let prompt = this.alertController.create({
            title: "Ajout d'ami",
            message: "Rentrez le code secret de votre ami, votre code est : " + this.userid,
            inputs: [
                {
                    name: 'uid',
                    placeholder: 'Code secret'
                },
            ],
            buttons: [
                {
                    text: 'Annuler',
                    handler: data => {
                    }
                },
                {
                    text: "Ajouter",
                    handler: data => {
                        this.addFriend(data.uid)
                    }
                }
            ]
        });
        prompt.present();
    }

    addFriend(uid: string) {
        console.log(uid)
        this.angularFire.database.object('/users/' + uid).take(1).subscribe(user => {
            console.log(user)
            if (user.$value) {
                this.angularFire.database.list('/users/' + this.userid + '/friends').push(uid);
            } else {
                this.alertController.create({
                    title: "Code invalide",
                    message: "Le code secret est invalide",
                    buttons: [{text: 'Ok'}]
                }).present();
            }
        })
    }
}