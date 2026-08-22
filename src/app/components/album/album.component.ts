import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton } from '@ionic/angular';
import { ApiService } from '../../service/api.servise';
import { FotoComponent } from '../foto/foto.component';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
  standalone: true,
  imports: [CommonModule, FotoComponent, IonButton],
})
export class AlbumComponent implements OnInit, OnChanges {
  @Input() albumId: number | null = null;

  fotos = signal<any[]>([]);
  indiceActual = signal(0);
  cargando = signal(false);
  error = signal<string | null>(null);
  fotoActual = computed(() => this.fotos()[this.indiceActual()] ?? null);

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarFotos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['albumId'] && this.albumId) {
      this.cargarFotos();
    }
  }

  private generarImagenLocal(title: string, index: number): string {
    const palette = ['#5260ff', '#3dc2ff', '#2dd36f', '#ff4961', '#ffc409', '#9b59b6'];
    const color = palette[index % palette.length];
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#f4f5f8"/>
            <stop offset="100%" stop-color="${color}"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#g)"/>
        <circle cx="400" cy="220" r="120" fill="rgba(255,255,255,0.35)"/>
        <path d="M260 470c35-100 125-155 250-155s215 55 250 155" fill="rgba(255,255,255,0.35)"/>
        <rect x="130" y="180" width="540" height="160" rx="24" fill="rgba(255,255,255,0.18)"/>
        <text x="400" y="270" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#ffffff" font-weight="700">Foto ${index + 1}</text>
        <text x="400" y="315" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#ffffff">${encodeURIComponent(title.slice(0, 32))}</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  private sanitizarUrlImagen(url: string | undefined, title?: string, index?: number): string {
    if (!url || url.includes('via.placeholder.com') || url.includes('placeholder')) {
      if (title && typeof index === 'number') {
        return this.generarImagenLocal(title, index);
      }
      return 'assets/placeholder-photo.svg';
    }

    return url;
  }

  cargarFotos(): void {
    if (!this.albumId) {
      this.error.set('No se pudo identificar el álbum.');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.apiService.getPhotosByAlbum(this.albumId).subscribe({
      next: (data) => {
        const fotos = (data ?? []).map((foto, index) => ({
          ...foto,
          url: this.sanitizarUrlImagen(foto?.url, foto?.title, index),
          thumbnailUrl: this.sanitizarUrlImagen(foto?.thumbnailUrl, foto?.title, index),
        }));

        this.fotos.set(fotos);
        this.indiceActual.set(0);
        this.cargando.set(false);

        if (this.fotos().length === 0) {
          this.error.set('Este álbum no tiene fotos disponibles.');
        }
      },
      error: () => {
        this.fotos.set([]);
        this.cargando.set(false);
        this.error.set('Hubo un error al cargar las imágenes del álbum.');
      },
    });
  }

  anterior(): void {
    if (this.fotos().length === 0) return;

    this.indiceActual.update((actual) => {
      return actual === 0 ? this.fotos().length - 1 : actual - 1;
    });
  }

  siguiente(): void {
    if (this.fotos().length === 0) return;

    this.indiceActual.update((actual) => {
      return actual === this.fotos().length - 1 ? 0 : actual + 1;
    });
  }

  volver(): void {
    this.router.navigate(['/home']);
  }

  reintentar(): void {
    this.cargarFotos();
  }
}
