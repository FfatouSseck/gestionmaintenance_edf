import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService{

  authenticationState = new BehaviorSubject(false);
  token: any;

  constructor(private storage: Storage, private plt: Platform, public http: HttpClient,
              public alertCtrl: AlertController) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }

  login(login, pwd) {
    console.log(login,pwd);
    var login_url = `${environment.apiUrl}`;
    var auth;

    this.makeBasicAuth(login, pwd);
    auth = this.token;
    console.log("token",auth);

    //create header
    var headers = new HttpHeaders();
    headers.append("Authorization",auth);
    headers.append("Access-Control-Allow-Credentials","true");
    headers.append("Access-Control-Allow-Method","GET,PUT,POST,DELETE,OPTIONS");
    headers.append("X-Requested-With","XMLHttpRequest");
    headers.append("Content-Type ","application/atom+xml");
    headers.append("DataServiceVersion","2.0");
    headers.append("X-CSRF-Token","Fetch");

    //we connect to the platform using http
    /*return this.storage.set(TOKEN_KEY, 'Bearer 1234567').then(() => {
      this.authenticationState.next(true);
    });*/

    this.http.get(login_url,{headers: headers}).subscribe(
      (res) =>{
        console.log("iciiiiiiiiii",res);
      },
      async (err) =>{
        const alert = await this.alertCtrl.create({
          header: 'Authentication failed',
          message: err.message,
          buttons: ['OK']
        });
        await alert.present();
        console.log("Authentication failed: ",err)
      }
    )
  }

  makeBasicAuth(login, pwd) {
    var Base64 = {

      //private property
      _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxxz0123456789+/=",

      //public method for encoding
      encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }

          output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);


        }
        return output;

      },

      //public method for decoding
      decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        while(i< input.length){
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
          }
        }

      
      output = Base64._utf8_decode(output);
      return output;
      },

      _utf8_encode: function(string){
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for(var n=0; n<string.length;n++){
          var c=string.charCodeAt(n);

          if(c<128){
            utftext += String.fromCharCode(c);
          }
          else if((c> 127) && (c<2048)){
            utftext += String.fromCharCode((c>>6) | 192);
            utftext += String.fromCharCode((c && 63) | 128);
          }
          else{
            utftext += String.fromCharCode((c>>12) | 224);
            utftext += String.fromCharCode(((c>>6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }
        }

        return utftext;
      },
      _utf8_decode: function(utftext){
        var string = "";
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;

        while(i<utftext.length){
          c=utftext.charCodeAt(i);

          if(c<128){
            string += String.fromCharCode(c);
            i++;
          }
          else if((c>191) && (c<224)){
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i+=2;
          }else{
            c2 = utftext.charCodeAt(i+1);
            var c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i+=3;
          }
        }
        return string;
      }
    }
    var tok = login + ':' + pwd;
    var hash = Base64.encode(tok);
    this.token = "Basic "+ hash;
  }

  logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

}
