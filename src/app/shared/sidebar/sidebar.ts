import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SubMenuItem {
  label: string;
  route?: string;
  subItems?: SubMenuItem[];
  isOpen?: boolean;
}

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  isActive?: boolean;
  isOpen?: boolean;
  subMenu?: SubMenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  isOpen = false;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      route: '/dashboard',
      isActive: true
    },
    {
      label: 'Tesorería',
      icon: 'fas fa-dollar-sign',
      isOpen: false,
      subMenu: [
        {
          label: 'Maestro de Cajas',
          isOpen: false,
          subItems: [
            { label: 'Crear Cajas', route: '/tesoreria/cajas/crear' },
            { label: 'Modificar Cajas', route: '/tesoreria/cajas/modificar' },
            { label: 'Listar Cajas', route: '/tesoreria/cajas/listar' }
          ]
        },
        {
          label: 'Asignación de Responsables',
          isOpen: false,
          subItems: [
            { label: 'Asignar por Turno', route: '/tesoreria/responsables/asignar' },
            { label: 'Historial por Caja', route: '/tesoreria/responsables/historial' }
          ]
        },
        {
          label: 'Conceptos y Gastos',
          isOpen: false,
          subItems: [
            { label: 'Conceptos de Movimiento', route: '/tesoreria/conceptos' },
            { label: 'Registrar Gastos', route: '/tesoreria/gastos/registrar' },
            { label: 'Sustentar Gastos', route: '/tesoreria/gastos/sustentar' }
          ]
        },
        {
          label: 'Gestión de Cajas',
          isOpen: false,
          subItems: [
            { label: 'Aperturar Caja', route: '/tesoreria/gestion/aperturar' },
            { label: 'Registrar Movimientos', route: '/tesoreria/gestion/movimientos' },
            { label: 'Transferencias', route: '/tesoreria/gestion/transferencias' },
            { label: 'Arqueo de Caja', route: '/tesoreria/gestion/arqueo' },
            { label: 'Cerrar Caja', route: '/tesoreria/gestion/cerrar' }
          ]
        },
        {
          label: 'Preliquidaciones',
          isOpen: false,
          subItems: [
            { label: 'Registrar Preliquidación', route: '/tesoreria/preliquidaciones/registrar' },
            { label: 'Aplicar Gastos', route: '/tesoreria/preliquidaciones/gastos' },
            { label: 'Vales y Préstamos', route: '/tesoreria/preliquidaciones/vales' }
          ]
        }
      ]
    },
    {
      label: 'Administración',
      icon: 'fas fa-shield-alt',
      isOpen: false,
      subMenu: [
        {
          label: 'Gestión de Usuarios',
          isOpen: false,
          subItems: [
            { label: 'Alta de Usuarios', route: '/admin/usuarios/alta' },
            { label: 'Baja de Usuarios', route: '/admin/usuarios/baja' }
          ]
        },
        {
          label: 'Seguridad',
          isOpen: false,
          subItems: [
            { label: 'Administrador de Roles', route: '/admin/seguridad/roles' },
            { label: 'Administrador de Permisos', route: '/admin/seguridad/permisos' }
          ]
        }
      ]
    }
  ];

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  toggleMenuItem(item: MenuItem): void {
    if (item.subMenu) {
      item.isOpen = !item.isOpen;
    }
  }

  toggleSubMenuItem(subItem: SubMenuItem): void {
    if (subItem.subItems) {
      subItem.isOpen = !subItem.isOpen;
    }
  }

  closeSidebar(): void {
    this.isOpen = false;
  }
}