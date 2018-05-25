import { Http } from '@angular/http';
import { TabsPage } from './../pages/tabs/tabs';
import { HomePage } from './../pages/home/home';
import { LoginPage } from './../pages/login/login';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  token;
  id;
  nama;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private nativeStorage: NativeStorage, public http: Http) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.nativeStorage.getItem('tmu').then(
        data => {
          console.log(JSON.stringify(data.token));
          if(data.token != '' && data.token) {
            this.http.get("http://slipgaji.karyakreativa.co.id/api/karyawan/checktoken/"+data.token)
              .subscribe(res => {
                this.rootPage = TabsPage;
              },
              error => {
                console.error(JSON.stringify(error));
                this.nativeStorage.setItem('tmu', {token : '', nama : ''});
                this.rootPage = LoginPage;
              });
          } else {
            this.rootPage = LoginPage;
          }
        },
        error => {
          console.error(JSON.stringify(error));
          this.rootPage = LoginPage;
        }
      );

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
