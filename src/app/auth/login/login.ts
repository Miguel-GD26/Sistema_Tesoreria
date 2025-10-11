import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class LoginComponent implements OnInit {
  username = '';
  password = '';
  rememberMe = false;
  showPassword = false;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private userService: UserService 
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      this.username = rememberedUser;
      this.rememberMe = true;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Validación de campos vacíos.
    if (!this.username || !this.password) {
      this.alertService.warning('Por favor, completa todos los campos', '¡Atención!');
      return;
    }

    // Muestra la alerta de "cargando".
    this.alertService.loadingWithGif('Verificando credenciales...');

    // --- Flujo de Autenticación en Dos Pasos ---

    // 1. Primer paso: Intentar obtener el token de autenticación.
        this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (tokenData) => {
        this.userService.fetchAndSetUserProfile(tokenData.access).subscribe({
          next: () => {
            this.alertService.close();
            this.alertService.toast('¡Bienvenido al sistema!', 'success');
            this.router.navigate(['/dashboard']);
          },
          
          error: (profileError) => {
            this.alertService.close();
            console.error("Login exitoso, pero falló al obtener el perfil", profileError);
            this.alertService.error(
              "Se pudo iniciar sesión, pero no se cargaron los datos del usuario. Por favor, intenta de nuevo.", 
              "Error de Perfil"
            );
            this.authService.logout(); 
          }
        });
      },
      
      error: (loginError) => {
        this.alertService.close();
        //console.error('Error de login:', loginError);
        this.alertService.error(
          'El usuario o contraseña son incorrectos. Por favor, intenta nuevamente.',
          'Credenciales inválidas'
        );
        this.password = '';
      }
    });
  } 
}