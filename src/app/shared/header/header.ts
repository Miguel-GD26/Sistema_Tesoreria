import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { UserService, User } from '../../services/user'; 
import { Subscription } from 'rxjs'; 

// Definición de la interfaz para las notificaciones
interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'info';
  icon: string;
  isRead: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  // --- Propiedades del Header ---
  pageTitle = 'Gestión de Rutas de Ventas';
  pageIcon = 'fas fa-route';
  
  // --- Propiedades del Usuario (se inicializan con valores por defecto) ---
  userName = 'Usuario';
  userInitials = 'U';
  userRole = 'Rol no asignado' ;
  userBranch = 'Sucursal Central'; 
  

  // --- Control de la Interfaz ---
  isNotificationDropdownOpen = false;
  isProfileDropdownOpen = false;
  isMobileNotificationModalOpen = false;

  // --- Notificaciones (datos de ejemplo) ---
  notifications: Notification[] = [
    { id: 1, title: 'Ruta completada', message: 'La ruta "Centro - Norte" se completó exitosamente.', time: 'Hace 5 min', type: 'success', icon: 'fas fa-check-circle', isRead: false },
    { id: 2, title: 'Retraso en entrega', message: 'Cliente "Comercial Los Andes" reporta retraso.', time: 'Hace 15 min', type: 'warning', icon: 'fas fa-exclamation-triangle', isRead: false },
    { id: 3, title: 'Nueva ruta asignada', message: 'Se te ha asignado la ruta "Sur - Residencial".', time: 'Hace 1 hora', type: 'info', icon: 'fas fa-info-circle', isRead: false },
    { id: 4, title: '¡Felicitaciones!', message: 'Has alcanzado el 98% de efectividad este mes.', time: 'Hace 3 horas', type: 'success', icon: 'fas fa-star', isRead: true },
    { id: 5, title: 'Reunión programada', message: 'Reunión de equipo mañana a las 9:00 AM.', time: 'Hace 5 horas', type: 'info', icon: 'fas fa-calendar-check', isRead: true }
  ];

  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private userService: UserService) {}
  
  ngOnInit(): void {
    // Nos suscribimos a los cambios en el perfil de usuario.
    // Esto asegura que si el perfil cambia en algún momento, el header se actualiza.
    this.userSubscription = this.userService.userProfile$.subscribe(profile => {
      if (profile) {
        this.updateUserInfo(profile);
      } else {
        this.resetUserInfo();
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  // --- Métodos de la Interfaz ---

  get unreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  toggleNotificationDropdown(event: Event): void {
    event.stopPropagation();
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    this.isProfileDropdownOpen = false;
  }

  toggleProfileDropdown(event: Event): void {
    event.stopPropagation();
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    this.isNotificationDropdownOpen = false;
  }

  toggleMobileNotificationModal(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isMobileNotificationModalOpen = !this.isMobileNotificationModalOpen;
    this.isProfileDropdownOpen = false;
  }

  closeMobileNotificationModal(): void {
    this.isMobileNotificationModalOpen = false;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
  }

  markNotificationAsRead(notification: Notification): void {
    notification.isRead = true;
  }

  // Cierra los menús desplegables si se hace clic fuera de ellos.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.closeDropdowns();
  }

  closeDropdowns(): void {
    this.isNotificationDropdownOpen = false;
    this.isProfileDropdownOpen = false;
  }

  /**
   * Cierra la sesión del usuario.
   * La lógica está centralizada en AuthService para mantener el código limpio.
   */
  logout(): void {
    this.authService.logout();
  }
  // --- Métodos de Utilidad ---

  /**
   * Formatea el nombre de usuario para que se vea mejor (ej. "admin" -> "Admin").
   */
  private formatUsername(name: string): string {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  /**
   * Calcula las iniciales del usuario para mostrarlas en el avatar.
   */
  private calculateInitials(name: string): string {
    if (!name) return 'U';
    
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length > 1) {
      return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
    } else if (parts.length === 1 && parts[0].length > 1) {
      return parts[0].substring(0, 2).toUpperCase();
    } else if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
    return 'U';
  }

  private updateUserInfo(profile: User): void {
    this.userName = this.formatUsername(profile.full_name);
    this.userInitials = this.calculateInitials(this.userName);
    this.userRole = this.userService.getRoleName(profile.rol);
  }

  private resetUserInfo(): void {
    this.userName = 'Usuario';
    this.userInitials = 'U';
    this.userRole = 'Rol no asignado';
  }

}