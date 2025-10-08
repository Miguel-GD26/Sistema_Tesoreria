import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  
  // Mensajes de error
  errorMessage = '';
  
  // Credenciales de prueba
  private readonly TEST_USER = 'admin';
  private readonly TEST_PASSWORD = '12345678';

  constructor(private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Limpiar mensaje de error previo
    this.errorMessage = '';

    // Validar campos vacíos
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    // Validar credenciales
    if (this.email === this.TEST_USER && this.password === this.TEST_PASSWORD) {
      // Login exitoso
      console.log('Login exitoso');
      
      // Guardar en localStorage si "Recordarme" está activo
      if (this.rememberMe) {
        localStorage.setItem('rememberedUser', this.email);
      }
      
      // Guardar sesión
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', this.email);
      
      // Redirigir al dashboard
      this.router.navigate(['/dashboard']);
    } else {
      // Credenciales incorrectas
      this.errorMessage = 'Usuario o contraseña incorrectos';
      
      // Limpiar contraseña por seguridad
      this.password = '';
    }
  }

  loginWithGoogle(): void {
    // Aquí iría la lógica de autenticación con Google
    console.log('Login con Google');
    // Por ahora, solo redirigir al dashboard para pruebas
    this.router.navigate(['/dashboard']);
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