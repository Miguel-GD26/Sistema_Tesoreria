import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // Credenciales del formulario
  email = '';
  password = '';
  rememberMe = false;
  
  // Control de visibilidad de contraseña
  showPassword = false;
  
  // Credenciales de prueba
  private readonly TEST_USER = 'admin';
  private readonly TEST_PASSWORD = '12345678';

  constructor(
    private router: Router,
    private alertService: AlertService
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Validar campos vacíos
    if (!this.email || !this.password) {
      this.alertService.warning('Por favor, completa todos los campos', '¡Atención!');
      return;
    }

    // Mostrar loading con GIF personalizado
    this.alertService.loadingWithGif('Verificando credenciales...');
    
    setTimeout(() => {
      // Validar credenciales
      if (this.email === this.TEST_USER && this.password === this.TEST_PASSWORD) {
        // Login exitoso
        
        // Guardar en localStorage si "Recordarme" está activo
        if (this.rememberMe) {
          localStorage.setItem('rememberedUser', this.email);
        }
        
        // Guardar sesión
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', this.email);
        
        // Cerrar loading y mostrar éxito
        this.alertService.close();
        this.alertService.toast('¡Bienvenido al sistema!', 'success');
        
        // Redirigir al dashboard
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 500);
      } else {
        // Credenciales incorrectas
        this.alertService.close();
        this.alertService.error(
          'El usuario o contraseña son incorrectos. Por favor, intenta nuevamente.',
          'Credenciales inválidas'
        );
        
        // Limpiar contraseña por seguridad
        this.password = '';
      }
    }, 1500);
  }

  
  ngOnInit(): void {
    // Verificar si hay un usuario recordado
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      this.email = rememberedUser;
      this.rememberMe = true;
    }

    // Si ya está logueado, redirigir al dashboard
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      this.router.navigate(['/dashboard']);
    }
  }
}