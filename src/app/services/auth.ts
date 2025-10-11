import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { UserService } from './user';

// --- INTERFACES PRECISAS PARA LA RESPUESTA DE LOGIN ---

/**
 * Describe el objeto { access, refresh }
 */
export interface TokenData {
  access: string;
  refresh: string;
}

/**
 * Describe el objeto { user, tokens, memberships } que está dentro de 'data'
 */
export interface LoginData {
  user: any; 
  tokens: TokenData;
  memberships: any[];
}

/**
 * Describe la respuesta completa de la API /login
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/v1';

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) { }

  /**
   * Realiza la petición de login y devuelve un Observable con los tokens extraídos.
   */
  login(credentials: { username: string, password: string }): Observable<TokenData> {
    const loginUrl = `${this.apiUrl}/auth/users/login/`;

    // 1. Decimos a HttpClient que la respuesta completa será de tipo LoginResponse
    return this.http.post<LoginResponse>(loginUrl, credentials).pipe(
      
      // 2. Usamos 'map' para navegar dentro de la respuesta y extraer solo el objeto 'tokens'
      map(response => response.data.tokens),

      // 3. 'tap' recibe el objeto TokenPayload (los tokens) y lo guarda
      tap(tokens => {
        //console.log("Tokens extraídos correctamente para guardar:", tokens);
        if (tokens && tokens.access) {
          this.saveTokens(tokens, credentials.username);
        } else {
          // Si por alguna razón 'data.tokens' no existe, lanzamos un error claro
          throw new Error("La estructura de la respuesta de login es inesperada.");
        }
      })
    );
  }
  
  private saveTokens(tokens: TokenData, username: string): void {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    localStorage.setItem('username', username);
  }

  logout(): void {
    this.userService.clearUserProfile();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('rememberedUser');
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}