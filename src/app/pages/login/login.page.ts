/* eslint-disable @typescript-eslint/quotes */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  public userLogin: User = {};
  public userRegister: User = {};
  private loading: any;

  constructor(
    private loadingCrtl: LoadingController,
    private toastCrtl: ToastController,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  segmentChanged(event: any) {
   if (event.detail.value === "login") {
     this.slides.slidePrev();
   }else {
     this.slides.slideNext();
   }
  }

  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);
      this.router.navigateByUrl('/teste');
    } catch (error) {

      this.presentToast(error.message);
    } finally {
      this.loading.dismiss();
    }
 }

 async register() {
  await this.presentLoading();

  try {
    await this.authService.register(this.userRegister);
  } catch (error) {
    let message: string;

    switch(error.code) {
      case 'auth/email-already-in-use': message = 'E-mail já está sendo utilizado';
      break;

      case 'auth/invalid-email': message = 'E-mail inválido';
      break;

      case 'auth/weak-password': message = 'Senha precisa de no mínimo 6 caracteres';
      break;
    }

    this.presentToast(message);
  } finally {
    this.loading.dismiss();
  }

}

async presentLoading() {
  this.loading = await this.loadingCrtl.create({ message: 'Por favor, aguarde...'});
  return this.loading.present();
}

async presentToast(message: string) {
  const toast = await this.toastCrtl.create({ message, duration: 2000 });
  toast.present();
}
}
