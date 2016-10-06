import { Component, Output, Input, EventEmitter } from '@angular/core';
import { AngularFire } from 'angularfire2';

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

    constructor(public angularFire: AngularFire) {}

    onInit() {
        console.log('aa', this.userid)
    }

    ngOnInit() {
        console.log('bb', this.userid)
        this.globalScoreSub = this.angularFire.database.object('/users/' + this.userid + '/scoreTotal').subscribe(scoreTotal => this.globalScore = scoreTotal.$value);
        this.angularFire.database.object('/users/' + this.userid + '/scoreTotal').take(1).subscribe(scoreTotal => {
            this.globalScore = scoreTotal.$value
            this.angularFire.database.list('/users/' + this.userid + '/messages', {
                query: {
                    orderByKey: true,
                    endAt: this.globalScore.toString()
                }
            }).take(1).subscribe(messages => {
                if (messages[messages.length - 1]) {
                    var messagesLocal = []
                    Object.keys(messages[messages.length - 1]).forEach(key => {
                        if (key != '$key' && key != '$exists') {
                            messagesLocal.push({ author: key, message: messages[messages.length - 1][key] })
                        }
                    })
                    this.message = messagesLocal
                }
            })
        });
    }

    logout() {
        this.globalScoreSub.unsubscribe();
        //this.angularFire.auth.logout();
        this.userLoggedOut.emit(false);
    }
}