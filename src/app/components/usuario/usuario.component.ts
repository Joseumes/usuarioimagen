import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonItem, IonLabel, IonList } from '@ionic/angular';
import { ApiService } from '../../service/api.servise';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  standalone: true,
  imports: [CommonModule, IonList, IonItem, IonLabel],
})
export class UsuarioComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    console.log('Iniciando carga de usuarios...');

    this.apiService.getUsers().subscribe({
      next: (data) => {
        console.log('Usuarios recibidos desde la API:', data);
        this.usuarios = data;
      },
      error: (error) => {
        console.error('Error obteniendo usuarios:', error);
      },
    });
  }

  seleccionarUsuario(usuario: any) {
    console.log('Usuario seleccionado:', usuario);
  }
}