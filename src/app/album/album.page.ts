import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { AlbumComponent } from '../components/album/album.component';

@Component({
  selector: 'app-album-page',
  templateUrl: './album.page.html',
  styleUrls: ['./album.page.scss'],
  standalone: true,
  imports: [IonHeader, IonTitle, IonToolbar, AlbumComponent],
})
export class AlbumPage implements OnInit {
  albumId = signal<number | null>(null);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.albumId.set(id || null);
  }
}
