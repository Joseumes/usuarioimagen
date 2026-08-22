import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonModal, IonTitle, IonToolbar } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.servise';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  standalone: true,
  imports: [CommonModule, IonList, IonItem, IonLabel, IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButton],
})
export class UsuarioComponent implements OnInit {
  usuarios = signal<any[]>([]);
  usuarioSeleccionado = signal<any | null>(null);
  albums = signal<any[]>([]);
  modalAbierto = signal(false);
  cargando = signal(false);
  cargandoAlbums = signal(false);
  errorAlbums = signal<string | null>(null);
  totalUsuarios = computed(() => this.usuarios().length);

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log('Iniciando carga de usuarios...');
    this.cargando.set(true);

    this.apiService.getUsers().subscribe({
      next: (data) => {
        console.log('Usuarios recibidos desde la API:', data);
        this.usuarios.set(data ?? []);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error obteniendo usuarios:', error);
        this.usuarios.set([]);
        this.cargando.set(false);
      },
    });
  }

  seleccionarUsuario(usuario: any) {
    console.log('Usuario seleccionado:', usuario);
    this.usuarioSeleccionado.set(usuario);
    this.errorAlbums.set(null);
    this.modalAbierto.set(true);
    this.cargandoAlbums.set(true);

    this.apiService.getAlbumsByUser(usuario.id).subscribe({
      next: (data) => {
        this.albums.set(data ?? []);
        this.cargandoAlbums.set(false);
      },
      error: (error) => {
        console.error('Error cargando albums:', error);
        this.albums.set([]);
        this.errorAlbums.set('No se pudieron cargar los álbumes de este usuario.');
        this.cargandoAlbums.set(false);
      },
    });
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.albums.set([]);
    this.errorAlbums.set(null);
    this.usuarioSeleccionado.set(null);
  }

  abrirAlbum(album: any) {
    this.router.navigate(['/album', album.id]);
    this.cerrarModal();
  }
}