import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http } from '@angular/http';

/**
 * Generated class for the PopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  template: `
    <ion-list>
      <ion-list-header>Menu</ion-list-header>
      <button ion-item (click)="logout()" icon-start>
        <ion-icon name="log-out"></ion-icon> Logout
      </button>
    </ion-list>
  `
})
export class PopoverPage {
  token;
  execution;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private nativeStorage: NativeStorage, public http: Http, public loadingCtrl: LoadingController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

  logout() {
    this.viewCtrl.dismiss();
    this.nativeStorage.getItem('tmu').then(
      data => {
        this.token = data.token;
        console.log(JSON.stringify(this.token));
        this.http.post('http://slipgaji.karyakreativa.co.id/api/karyawan/logout', { 'token' : this.token })
        .subscribe(data => {
          console.log(JSON.stringify(data));
          let body = data.json();
          this.execution = body.execution;
          this.presentLoadingDefault();
        });
      },
      error => {console.error(JSON.stringify(error))}
    );
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Mohon tunggu ...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
      this.nativeStorage.setItem('tmu', {token : '', nama : '', id : ''});
      this.navCtrl.setRoot(LoginPage);
    }, this.execution);
  }

}
