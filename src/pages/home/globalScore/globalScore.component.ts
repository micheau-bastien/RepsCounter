import { Component, Output, EventEmitter } from '@angular/core';
import { AngularFire } from 'angularfire2';

@Component({
    selector: 'globalscore',
    templateUrl: './globalScore.component.html',
})
export class GlobalScoreComponent {

    @Output() userLoggedOut = new EventEmitter();

    globalScore: number = undefined
    message: any[] = undefined

    constructor(public angularFire: AngularFire) {
        this.angularFire.auth.subscribe(user => {
            if (user) {
                this.angularFire.database.object('/users/' + user.uid + '/scoreTotal').subscribe(data => {
                    this.globalScore = data.$value
                    this.angularFire.database.list('/users/' + user.uid + '/messages', {
                        query: {
                            orderByKey: true,
                            endAt: this.globalScore.toString()
                        }
                    }).subscribe(data => {
                        if (data[data.length - 1]) {
                            var messagesLocal = []
                            Object.keys(data[data.length - 1]).forEach(key => {
                                if (key != '$key' && key != '$exists') {
                                    messagesLocal.push({ author: key, message: data[data.length - 1][key] })
                                }
                            })
                            this.message = messagesLocal
                        }
                    })
                })
            }
        })
    }

    logout() {
        //this.angularFire.auth.logout();
        this.userLoggedOut.emit(false);
    }
}