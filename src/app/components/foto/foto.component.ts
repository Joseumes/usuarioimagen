import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonButton } from '@ionic/angular';

@Component({
  selector: 'app-foto',
  templateUrl: './foto.component.html',
  styleUrls: ['./foto.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton],
})
export class FotoComponent {
  @Input() foto: any | null = null;
  @Input() indice = 0;
  @Input() total = 0;

  @Output() anterior = new EventEmitter<void>();
  @Output() siguiente = new EventEmitter<void>();
  @Output() volver = new EventEmitter<void>();

  get imagenUrl(): string {
    return this.foto?.url || 'assets/placeholder-photo.svg';
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/placeholder-photo.svg';
    }
  }

  irAnterior(): void {
    this.anterior.emit();
  }

  irSiguiente(): void {
    this.siguiente.emit();
  }

  regresar(): void {
    this.volver.emit();
  }
}
