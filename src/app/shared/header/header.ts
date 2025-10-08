import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class HeaderComponent {
  pageTitle = 'Gestión de Rutas de Ventas';
  pageIcon = 'fas fa-route';
  
  // Usuario
  userName = 'Javier López';
  userInitials = 'JL';
  userRole = 'Vendedor Senior';
  userBranch = 'Sucursal Central';
  
  // Estadísticas del usuario
  userStats = {
    routes: 24,
    clients: 156,
    success: 98
  };

  // Estado de los dropdowns
  isNotificationDropdownOpen = false;
  isProfileDropdownOpen = false;
  isMobileNotificationModalOpen = false;

  // Notificaciones
  notifications: Notification[] = [
    {
      id: 1,
      title: 'Ruta completada exitosamente',
      message: 'La ruta "Centro - Norte" se completó con 15 entregas exitosas',
      time: 'Hace 5 minutos',
      type: 'success',
      icon: 'fas fa-check-circle',
      isRead: false
    },
    {
      id: 2,
      title: 'Retraso en entrega',
      message: 'El cliente "Comercial Los Andes" reporta retraso de 30 min',
      time: 'Hace 15 minutos',
      type: 'warning',
      icon: 'fas fa-exclamation-triangle',
      isRead: false
    },
    {
      id: 3,
      title: 'Nueva ruta asignada',
      message: 'Se te ha asignado la ruta "Sur - Residencial" para mañana',
      time: 'Hace 1 hora',
      type: 'info',
      icon: 'fas fa-info-circle',
      isRead: false
    },
    {
      id: 4,
      title: '¡Felicitaciones!',
      message: 'Has alcanzado el 98% de efectividad este mes',
      time: 'Hace 3 horas',
      type: 'success',
      icon: 'fas fa-star',
      isRead: true
    },
    {
      id: 5,
      title: 'Reunión programada',
      message: 'Reunión de equipo mañana a las 9:00 AM',
      time: 'Hace 5 horas',
      type: 'info',
      icon: 'fas fa-calendar-check',
      isRead: true
    }
  ];

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

  closeDropdowns(): void {
    this.isNotificationDropdownOpen = false;
    this.isProfileDropdownOpen = false;
  }

  logout(): void {
    // Implementar lógica de cierre de sesión
    console.log('Cerrando sesión...');
  }
}