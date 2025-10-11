import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService, User } from '../../../services/user';
import { AlertService } from '../../../services/alert'; 

// Interfaz para el modelo del formulario, que puede contener propiedades opcionales
interface UserFormModel extends Partial<User> {
  password_confirm?: string;
}

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-modal.html',
  styleUrls: ['./user-modal.css']
})
export class UserModalComponent implements OnInit {
  // --- Entradas y Salidas del Componente ---
  @Input() userToEdit: User | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveSuccess = new EventEmitter<void>();

  // --- Propiedades del Componente ---
  @ViewChild('userForm') userForm!: NgForm;
  isEditMode = false;
  userModel: UserFormModel = {};
  roles: { id: number, name: string }[] = [];
  showPassword = false;
  showPasswordConfirm = false;
  
  // Almacena los errores de validación que vienen de la API
  apiErrors: { [key: string]: string[] } = {};

  // Diccionario para traducir los mensajes de error del backend
  private errorTranslations: { [key: string]: string } = {
    // Errores genéricos
    "This field may not be blank.": "Este campo no puede estar vacío.",
    "This field is required.": "Este campo es obligatorio.",

    // Errores de username
    "User with this username already exists.": "Ya existe un usuario con este nombre de usuario.",
    "Enter a valid username.": "Introduce un nombre de usuario válido.",

    // Errores de email
    "User with this email already exists.": "Ya existe un usuario con este correo electrónico.",
    "Enter a valid email address.": "Introduce una dirección de correo válida.",

    // Errores de password
    "Password must contain at least one uppercase letter.": "La contraseña debe contener al menos una mayúscula.",
    "Password must contain at least one special character.": "La contraseña debe contener al menos un carácter especial.",
    "Password contains common patterns that are not allowed.": "La contraseña es demasiado común o predecible.",
    "This password is too common.": "Esta contraseña es demasiado común.",
    "The password is too similar to the username.": "La contraseña no puede ser similar al nombre de usuario.",
    "Passwords do not match.": "Las contraseñas no coinciden.",
    "Password must contain at least one lowercase letter.":"La contraseña debe contener al menos una letra minúscula",
  };

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.roles = this.userService.getRoles();
    if (this.userToEdit) {
      this.isEditMode = true;
      this.userModel = { ...this.userToEdit };
    } else {
      this.isEditMode = false;
      this.userModel = { is_active: true };
    }
  }

  /**
   * Se ejecuta al enviar el formulario.
   */
  onSave(): void {
    // 1. Limpiamos errores previos
    this.apiErrors = {};

    // 2. Validamos el estado del formulario de Angular
    if (this.userForm.invalid) {
      Object.values(this.userForm.controls).forEach(control => control.markAsTouched());
      this.alertService.warning('Por favor, completa todos los campos obligatorios.', 'Formulario Incompleto');
      return;
    }

    // 3. Validamos la confirmación de contraseña (solo en modo creación)
    if (!this.isEditMode && this.userModel.password !== this.userModel.password_confirm) {
      this.apiErrors['password_confirm'] = ['Las contraseñas no coinciden.'];
      this.alertService.warning('Las contraseñas no coinciden.', 'Verificación Fallida');
      return;
    }

    // 4. Preparamos los datos para enviar
    const dataToSend = { ...this.userModel };
    if (dataToSend.rol) {
      dataToSend.rol = +dataToSend.rol;
    }

    // 5. Mostramos la alerta de "cargando"
    this.alertService.loading('Guardando usuario...');

    // 6. Ejecutamos la acción correspondiente (Crear o Actualizar)
    if (this.isEditMode && dataToSend.username) {
      const { username, password, password_confirm, ...updateData } = dataToSend;
      this.userService.updateUser(username, updateData).subscribe({
        next: () => {
          this.alertService.close();
          this.saveSuccess.emit();
        },
        error: (err) => this.handleApiError(err, 'actualizar')
      });
    } else {
      this.userService.createUser(dataToSend as User).subscribe({
        next: () => {
          this.alertService.close();
          this.saveSuccess.emit();
        },
        error: (err) => this.handleApiError(err, 'crear')
      });
    }
  }

  /**
   * Procesa la respuesta de error de la API, la traduce y la muestra.
   */
  private handleApiError(err: any, action: 'crear' | 'actualizar'): void {
    this.alertService.close();
    //console.error(`Error al ${action} usuario`, err);
    
    if (err.status === 400 && err.error) {
      const translatedErrors: { [key: string]: string[] } = {};
      for (const field in err.error) {
        const messages = err.error[field];
        translatedErrors[field] = messages.map((message: string) => this.translateErrorMessage(message));
      }
      this.apiErrors = translatedErrors;
      this.alertService.warning('Por favor, revisa los errores en el formulario.', 'Datos Inválidos');
    } else {
      this.apiErrors['non_field_errors'] = ['Ocurrió un error inesperado en el servidor. Inténtalo de nuevo.'];
      this.alertService.error('Ocurrió un error inesperado en el servidor. Por favor, contacta a soporte.', 'Error del Servidor');
    }
  }

  /**
   * Busca un mensaje de error en el diccionario y devuelve su traducción.
   */
  private translateErrorMessage(englishMessage: string): string {
    return this.errorTranslations[englishMessage] || englishMessage;
  }

  /**
   * Emite el evento para cerrar el modal.
   */
  onClose(): void {
    this.closeModal.emit();
  }
}