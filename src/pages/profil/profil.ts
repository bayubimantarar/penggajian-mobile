import { LoginPage } from './../login/login';
import { Http } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { PopoverPage } from './../popover/popover';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, LoadingController, AlertController } from 'ionic-angular';

/**
 * Generated class for the ProfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html',
})
export class ProfilPage {
  id;
  token;
  old_password;
  new_password;
  confirmation_new_password;
  execution;
  message;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public popoverCtrl : PopoverController,
    public nativeStorage : NativeStorage,
    public http : Http,
    public loadingCtrl : LoadingController,
    public alertCtrl : AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilPage');
  }

  onSubmit(){
    this.presentLoading();
  }

  presentMenu(myEvent){
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  presentLoading() {
    let loading = this.loadingCtrl.create({
      content: 'Mohon tunggu ...'
    });
  
    loading.present();
  
    setTimeout(() => {
      this.nativeStorage.getItem('tmu').then(
      data => {
        console.log(JSON.stringify(data.token));
        this.id = data.id;
        this.token = data.token;
        console.log(this.token);
        this.http.post("http://slipgaji.karyakreativa.co.id/api/karyawan/changeprofile", {token : this.token, id: this.id, old_password: this.old_password, new_password : this.new_password, confirmation_new_password: this.confirmation_new_password})
        .subscribe(data => {
          let body = data.json();
          console.log(JSON.stringify(body));
          this.execution = body.execution;
          this.message = body.message;

          if(body.success == 1){
            this.presentAlertSuccess();
          }else{
            this.presentAlertFail();
          }
        });
      },
      error => {console.error(JSON.stringify(error))}
    );
      loading.dismiss();
    }, this.execution);
  }

  presentAlertSuccess() {
    let alert = this.alertCtrl.create({
      title: 'Notifikasi',
      subTitle: 'Kata Sandi berhasil diubah',
      buttons: ['OK']
    });
    alert.present();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  presentAlertFail() {
    let alert = this.alertCtrl.create({
      title: 'Notifikasi',
      subTitle: this.message,
      buttons: ['OK']
    });
    alert.present();
  }

}
