import { TabsPage } from './../tabs/tabs';
import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NativeStorage } from '@ionic-native/native-storage';
import 'rxjs/Rx';
import 'rxjs/add/operator/map'

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  nik;
  password;
  token;
  nama;
  id;
  execution;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public http: Http, private nativeStorage: NativeStorage, private alertCtrl: AlertController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onLogin(){
    this.http.post("http://slipgaji.karyakreativa.co.id/api/karyawan/login", {'nik' : this.nik, 'password' : this.password})
    .subscribe(
      data => {
        let body  = data.json();
        let token = body.token;
        let nama  = body.data.nama;
        let id    = body.data.id;
        this.execution = body.execution;
        console.log(token+'===='+id);

        this.nativeStorage.setItem('tmu', {token: token, id: id, nama: nama})
          .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
        );

        this.presentLoadingDefaultSuccess();
      },
      error => {
        this.presentLoadingDefaultError();
      }
    );
  }

  presentLoadingDefaultSuccess() {
    let loading = this.loadingCtrl.create({
      content: 'Mohon tunggu ...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
      this.navCtrl.setRoot(TabsPage);
    }, this.execution);
  }

  presentLoadingDefaultError() {
    let loading = this.loadingCtrl.create({
      content: 'Mohon tunggu ...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
      this.presentAlert();
    }, this.execution);
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Notifikasi',
      subTitle: 'NIK atau Kata Sandi salah ...',
      buttons: ['OK']
    });
    alert.present();
  }
  

}
