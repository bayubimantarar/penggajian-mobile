import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the SlipgajiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slipgaji',
  templateUrl: 'slipgaji.html',
})
export class SlipgajiPage {
  //For filter
  bulan:any;
  tahun:any;
  id:any;
  token:any;
  nama:any;
  nik:any;

  //For slip gaji
  gaji_pokok:any;
  kinerja:any;
  makan:any;
  transport:any;
  bpjs_1:any;
  bpjs_2:any;

  //tunjangan
  lembur:any;

  //potongan
  pinjaman:any;
  kehadiran:any;
  kekurangan_jam_kerja:any;
  premi_ketenaga_kerjaan_1:any;
  premi_kesehatan_1:any;
  premi_ketenaga_kerjaan_2:any;
  premi_kesehatan_2:any;

  //total
  total_penghasilan:any;
  total_potongan:any;
  total_gaji:any;
  total_pembulatan:any;
  total_penghasilan_dan_tunjangan:any;
  total_penghasilantunjangan_dan_potongan:any;

  //periode
  periode_bulan:any;
  periode_tahun:any;

  execution:any;

  constructor(
    public navCtrl: NavController, 
    public platform: Platform, 
    public navParams: NavParams, 
    private nativeStorage: NativeStorage, 
    public http: Http, 
    public loadingCtrl: LoadingController, 
    private alertCtrl : AlertController, 
    private transfer: FileTransfer, 
    private FileOpener : FileOpener, 
    private file: File) {
    
    this.bulan = navParams.get("bulan");
    this.tahun = navParams.get("tahun");
    this.presentLoadingDefault()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SlipgajiPage');
  }

  onDownload(){
    this.presentLoadingDownload();
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Mohon tunggu ...'
    });
  
    loading.present();
  
    setTimeout(() => {
      this.nativeStorage.getItem('tmu').then(
        data => {
          this.id = data.id;
          this.token = data.token;
          this.nama = data.nama;
          this.http.get("http://slipgaji.karyakreativa.co.id/api/karyawan/getslipgaji/"+this.token+"/"+this.id+"/"+this.bulan+"/"+this.tahun)
          .subscribe(data => {
            let body  = data.json();
            if(body.status == 1){
              console.log(JSON.stringify(body));
              this.execution = body.execution;
              console.log(JSON.parse(this.execution));
              this.nik = body[0].identitas.nik;
              this.periode_bulan = body[0].periode.bulan;
              this.periode_tahun = body[0].periode.tahun;
              this.gaji_pokok = body[0].penghasilan.gaji_pokok;
              this.kinerja = body[0].penghasilan.kinerja;
              this.makan = body[0].penghasilan.makan;
              this.transport = body[0].penghasilan.transport;
              this.bpjs_1 = body[0].penghasilan.bpjs_1;
              this.bpjs_2 = body[0].penghasilan.bpjs_2;
              this.lembur = body[0].tunjangan.lembur;
              this.pinjaman = body[0].potongan.pinjaman;
              this.kehadiran = body[0].potongan.kehadiran;
              this.kekurangan_jam_kerja = body[0].potongan.kekurangan_jam_kerja;
              this.premi_ketenaga_kerjaan_1 = body[0].potongan.premi_ketenaga_kerjaan_1;
              this.premi_kesehatan_1 = body[0].potongan.premi_kesehatan_1;
              this.premi_ketenaga_kerjaan_2 = body[0].potongan.premi_ketenaga_kerjaan_2;
              this.premi_kesehatan_2 = body[0].potongan.premi_kesehatan_2;
              this.total_penghasilan = body[0].total.total_penghasilan;
              this.total_penghasilan_dan_tunjangan = body[0].total.total_penghasilan_dan_tunjangan;
              this.total_penghasilantunjangan_dan_potongan = body[0].total.total_penghasilantunjangan_dan_potongan;
              this.total_potongan = body[0].total.total_potongan;
              this.total_pembulatan = body[0].total.total_pembulatan;
              this.total_gaji = body[0].total.total_gaji;
            }else{
              this.presentAlert();
            }
          });
        }
      );
      loading.dismiss();
    }, this.execution);
  }

  presentLoadingDownload() {
    let loading = this.loadingCtrl.create({
      content: 'Mohon tunggu ...'
    });
  
    loading.present();
  
    setTimeout(() => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      const url = 'http://slipgaji.karyakreativa.co.id/api/karyawan/downloadslipgaji/'+this.token+'/'+this.id+'/'+this.bulan+'/'+this.tahun;
      const localpath = this.platform.is('android') ? this.file.externalCacheDirectory + 'file.pdf' : this.file.cacheDirectory + 'file.pdf'
      fileTransfer.download(url, localpath)
      .then((entry) => {
        console.log('download complete: ' + JSON.stringify(entry));
        this.FileOpener.open(entry.toURL(), 'application/pdf');
      }, (error) => {
        console.log(JSON.stringify(error))
      });
      loading.dismiss();
    }, 5000);
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Notifikasi',
      subTitle: 'Mohon maaf slip gaji belum tersedia ...',
      buttons: ['OK']
    });
    alert.present();
    this.navCtrl.popTo(TabsPage);
  }
}
