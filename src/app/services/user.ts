import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';

// --- INTERFACES ---

export interface User {
  // id?: number; 
  username: string;
  full_name: string;
  email: string;
  rol: number;
  is_active: boolean;
  password?: string;
  password_confirm?: string;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination: any;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userProfileSubject = new BehaviorSubject<User | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  private roleMap: { [key: number]: string } = {
    1: 'Administrador',
    2: 'Jefe de Ventas',
    3: 'Vendedor',
    4: 'Repartidor',
    6: 'Chofer',
    7: 'Responsable de Línea',
    8: 'Facturación'
  };
  
  private readonly apiUrl = '/api/v1/auth/users/';

  constructor(private http: HttpClient) {
    this.loadProfileFromStorage();
  }

  // --- MÉTODOS DE PERFIL ---
  fetchAndSetUserProfile(accessToken: string): Observable<User> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${accessToken}` });
    return this.http.get<UserProfileResponse>(`${this.apiUrl}profile/`, { headers }).pipe(
      map(response => response.data),
      tap(profile => {
        if (profile) {
          this.userProfileSubject.next(profile);
          localStorage.setItem('userProfile', JSON.stringify(profile));
        }
      })
    );
  }

  // --- MÉTODOS CRUD PARA GESTIÓN DE USUARIOS ---

  getUsers(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(this.apiUrl);
  }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${username}/`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(username: string, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}${username}/`, user);
  }

  deleteUser(username: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${username}/`);
  }

  // --- MÉTODOS DE UTILIDAD ---
  
  getRoleName(roleId: number): string {
    return this.roleMap[roleId] || 'Rol Desconocido';
  }

  getRoles(): { id: number, name: string }[] {
    return Object.entries(this.roleMap).map(([id, name]) => ({ id: +id, name }));
  }

  clearUserProfile(): void {
    localStorage.removeItem('userProfile');
    this.userProfileSubject.next(null);
  }

  private loadProfileFromStorage(): void {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      this.userProfileSubject.next(JSON.parse(storedProfile));
    }
  }
}