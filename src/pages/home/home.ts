import { Http } from '@angular/http';
import { PopoverPage } from './../popover/popover';
import { SlipgajiPage } from './../slipgaji/slipgaji';
import { Component } from '@angular/core';
import { NavController, Platform, ModalController, NavParams, ViewController, PopoverController, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //For filter
  bulan:any;
  tahun:any;
  id:any;
  token:any;
  nama:any;
  nik:any;
  periode:any;

  cuti:any;
  ijin:any;
  bolos:any;
  kek_jam_kerja:any;
  weekday:any;
  weekend:any;
  holiday:any;

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
    public modalCtrl: ModalController, 
    public popoverCtrl: PopoverController, 
    private nativeStorage: NativeStorage, 
    public loadingCtrl: LoadingController,
    public http: Http,
    private transfer: FileTransfer, 
    private FileOpener : FileOpener, 
    private file: File) { }

  ionViewDidLoad() {
    this.presentLoadingDefault();
  }

  presentMenu(myEvent){
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Mohon tunggu ...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
      this.nativeStorage.getItem('tmu').then(
        data => {
          console.log(JSON.stringify(data.token));
          this.nama = data.nama;
          this.id = data.id;
          this.token = data.token;
          this.http.get("http://slipgaji.karyakreativa.co.id/api/karyawan/getslipgaji/"+this.token+"/"+this.id)
          .subscribe(data => {
            let body  = data.json();
              this.periode = body[0].periode;
              this.execution = body.execution;
              this.nik = body[0].identitas.nik;
              this.periode_bulan = body[0].periode.bulan;
              this.periode_tahun = body[0].periode.tahun;
              this.cuti = body[0].absensi.cuti;
              this.ijin = body[0].absensi.ijin;
              this.bolos = body[0].absensi.bolos;
              this.kek_jam_kerja = body[0].absensi.kek_jam_kerja;
              this.weekday = body[0].absensi.weekday;
              this.weekend = body[0].absensi.weekend;
              this.holiday = body[0].absensi.holiday;
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
          });
        },
        error => {console.error(JSON.stringify(error))}
      );
    }, this.execution);
  }

  onDownload(){
    this.presentLoadingDownload();
  }

  presentLoadingDownload() {
    let loading = this.loadingCtrl.create({
      content: 'Mohon tunggu ...'
    });
  
    loading.present();
  
    setTimeout(() => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      const url = 'http://slipgaji.karyakreativa.co.id/api/karyawan/downloadslipgaji/'+this.token+'/'+this.id;
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

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.presentLoadingDefault();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, this.execution);
  }

}
