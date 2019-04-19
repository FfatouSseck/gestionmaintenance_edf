import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, private alertCtrl: AlertController) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#4BA0EF');
      this.splashScreen.hide();
      this.platform.backButton.subscribe(
        async () => {
          const alert = await this.alertCtrl.create({
            header: 'App termination',
            message: 'Do you want to close the app?',
            buttons: [{
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Application exit prevented!');
              }
            }, {
              text: 'Close App',
              handler: () => {
                navigator['app'].exitApp(); // work for ionic 4
                //this.platform.  // Close this application
              }
            }]
          });
          await alert.present();
        }
      )

    });
  }
}
