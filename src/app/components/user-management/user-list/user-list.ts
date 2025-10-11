import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../../services/user';
import { UserModalComponent } from '../user-modal/user-modal';
import { AlertService } from '../../../services/alert';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserModalComponent],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isModalOpen = false;
  selectedUser: User | null = null;

  constructor(
    public userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.alertService.loadingWithGif('Cargando usuarios...');

    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data;
        this.alertService.close();
      },
      error: (err) => {
        this.alertService.error('No se pudo cargar la lista de usuarios.', 'Error de Carga');
      }
    });
  }

  openCreateModal(): void {
    this.selectedUser = null;
    this.isModalOpen = true;
  }

  openEditModal(user: User): void {
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  handleCloseModal(): void {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  handleSaveSuccess(): void {
    this.alertService.toast('¡Usuario guardado exitosamente!', 'success');
    this.isModalOpen = false;
    this.selectedUser = null;
    this.loadUsers();
  }

  onDeleteUser(user: User): void {
    this.alertService.delete(
      `Esta acción no se puede revertir. Se eliminará permanentemente al usuario "${user.full_name}".`,
      `¿Estás seguro de eliminar?`
    ).then((result) => {
      if (result.isConfirmed) {
        this.alertService.loadingWithGif('Eliminando usuario...');
        this.userService.deleteUser(user.username).subscribe({
          next: () => {
            this.alertService.toast('Usuario eliminado con éxito.', 'success');
            this.loadUsers();
          },
          error: (err) => {
            this.alertService.error('No se pudo eliminar el usuario.', 'Error en la Operación');
          }
        });
      }
    });
  }
}