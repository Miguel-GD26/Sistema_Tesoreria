import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  /**
   * Muestra una alerta de éxito
   */
  success(message: string, title: string = '¡Éxito!') {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1976D2',
      timer: 3000,
      timerProgressBar: true
    });
  }

  /**
   * Muestra una alerta de error
   */
  error(message: string, title: string = '¡Error!') {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1976D2'
    });
  }

  /**
   * Muestra una alerta de advertencia
   */
  warning(message: string, title: string = '¡Advertencia!') {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1976D2'
    });
  }

  /**
   * Muestra una alerta de información
   */
  info(message: string, title: string = 'Información') {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: message,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1976D2'
    });
  }

  /**
   * Muestra una alerta de confirmación
   */
  confirm(message: string, title: string = '¿Estás seguro?') {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1976D2',
      cancelButtonColor: '#64748B',
      reverseButtons: true
    });
  }

  /**
   * Muestra una alerta de eliminación
   */
  delete(message: string = '¡No podrás revertir esto!', title: string = '¿Estás seguro?') {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#64748B',
      reverseButtons: true
    });
  }

  /**
   * Muestra un toast (notificación pequeña)
   */
  toast(message: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    return Toast.fire({
      icon: icon,
      title: message
    });
  }

  /**
   * Muestra una alerta personalizada
   */
  custom(options: any) {
    return Swal.fire(options);
  }

  /**
   * Alerta de carga/loading
   */
  loading(message: string = 'Procesando...', title: string = 'Por favor espera') {
    return Swal.fire({
      title: title,
      text: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * Loading personalizado con GIF
   */
  loadingWithGif(message: string = 'Procesando...', gifUrl?: string) {
    const defaultGif = 'progress.gif'; // GIF por defecto (spinner azul)
    
    return Swal.fire({
      title: message,
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; padding: 1rem;">
          <img src="${gifUrl || defaultGif}" 
               style="width: 210px; height: 210px; object-fit: contain; margin-bottom: 1rem;" 
               alt="Cargando...">
          <div style="color: #64748B; font-size: 0.98rem; margin-top: 0.5rem;">
            Esto puede tomar unos segundos...
          </div>
        </div>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: '#fff',
      backdrop: 'rgba(0, 0, 0, 0.4)'
    });
  }

  /**
   * Loading con progreso animado
   */
  loadingWithProgress(message: string = 'Cargando...') {
    return Swal.fire({
      title: message,
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; padding: 1.5rem 1rem;">
          <div style="position: relative; width: 120px; height: 120px; margin-bottom: 1rem;">
            <svg style="transform: rotate(-90deg);" width="120" height="120">
              <circle cx="60" cy="60" r="54" stroke="#E2E8F0" stroke-width="8" fill="none"/>
              <circle cx="60" cy="60" r="54" stroke="#1976D2" stroke-width="8" fill="none"
                      stroke-dasharray="339.292" stroke-dashoffset="0"
                      style="animation: progress 2s ease-in-out infinite;">
                <animate attributeName="stroke-dashoffset" 
                         from="339.292" to="0" 
                         dur="2s" 
                         repeatCount="indefinite"/>
              </circle>
            </svg>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        font-size: 1.5rem; font-weight: 700; color: #1976D2;">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
          </div>
          <div style="color: #64748B; font-size: 0.9rem;">Por favor espera...</div>
        </div>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false
    });
  }

  /**
   * Cierra cualquier alerta activa
   */
  close() {
    Swal.close();
  }
}