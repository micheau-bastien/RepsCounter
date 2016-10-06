import { Component, Input } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import 'rxjs/add/operator/take'
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'score',
    templateUrl: './score.component.html',
})
export class ScoreComponent {
    @Input() userid: any;

    isSelf: boolean = false;
    userData: any = {};
    userInit: boolean = false;

    nameExercise: string = '';
    scoreAccess: number = 0;
    textMessage: string = '';
    actualUser: any = undefined;

    scoreSub: any = undefined

    constructor(public angularFire: AngularFire, public alertController: AlertController) {
        this.angularFire.auth.subscribe(user => {
            this.actualUser = user.auth
        })
    }

    ngOnInit() {
        if (!this.userInit) {
            this.userInit = true;
            this.scoreSub = this.angularFire.database.list('/users/' + this.userid + '/scores').subscribe(scores => {
                this.userData.scores = scores;
            });
            this.angularFire.database.object('/users/' + this.userid + '/name').take(1).subscribe(name => this.userData.name = name.$value);
            this.angularFire.database.object('/users/' + this.userid + '/scoreTotal').take(1).subscribe(scoreTotal => this.userData.scoreTotal = scoreTotal.$value);
            this.isSelf = (this.userid == this.actualUser.uid ? true : false);
        }
    }

    showsRewardAlert() {
        let prompt = this.alertController.create({
            title: 'Récompense',
            message: "Entrez une nouvelle récompense pour votre ami(e).",
            inputs: [
                {
                    name: 'score',
                    placeholder: 'Score',
                    type: "number"
                },
                {
                    name: 'reward',
                    placeholder: 'Reward'
                },
            ],
            buttons: [
                {
                    text: 'Annuler',
                    handler: data => {
                    }
                },
                {
                    text: 'Ajouter',
                    handler: data => {
                        this.addMessage(data.score, data.reward)
                    }
                }
            ]
        });
        prompt.present();
    }

    showsAddExerciseAlert() {
        let prompt = this.alertController.create({
            title: 'Nouvel exercice',
            message: "Entrez le nouvel exercice que vous ferez. ",
            inputs: [
                {
                    name: 'exercice',
                    placeholder: 'Exercice'
                },
            ],
            buttons: [
                {
                    text: 'Annuler',
                    handler: data => {
                    }
                },
                {
                    text: 'Ajouter',
                    handler: data => {
                        this.addExercise(data.exercice)
                    }
                }
            ]
        });
        prompt.present();
    }

    add(key: string, nbToAdd: number) {
        this.angularFire.database.object('/users/' + this.actualUser.uid + '/scores/' + key).take(1).subscribe(data => {
            this.angularFire.database.object('/users/' + this.actualUser.uid + '/scores/' + key).set(data.$value + nbToAdd);
        })
        this.angularFire.database.object('/users/' + this.actualUser.uid + '/scoreTotal').take(1).subscribe(data => {
            this.angularFire.database.object('/users/' + this.actualUser.uid + '/scoreTotal').set(data.$value + nbToAdd);
        })
    }

    addExercise(name: string) {
        this.angularFire.database.object('/users/' + this.actualUser.uid + '/scores/' + name).set(0).then(_ => {
            this.nameExercise = '';
        })
    }

    addMessage(scoreAccess: number, textMessage: string) {
        this.angularFire.database.object('/users/' + this.userid + '/messages/' + scoreAccess + '/' + this.actualUser.displayName).set(textMessage);
    }

    ngOnDestroy(){
        this.scoreSub.unsubscribe();
    }
}