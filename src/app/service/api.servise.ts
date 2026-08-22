import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';

  private fallbackPhotos = Array.from({ length: 12 }, (_, index) => {
    const title = `Foto ${index + 1} del álbum`;
    const color = ['#5260ff', '#3dc2ff', '#2dd36f', '#ff4961', '#ffc409', '#9b59b6'][index % 6];
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#f5f6fa"/>
            <stop offset="100%" stop-color="${color}"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#g)"/>
        <circle cx="400" cy="220" r="120" fill="rgba(255,255,255,0.35)"/>
        <path d="M260 470c35-100 125-155 250-155s215 55 250 155" fill="rgba(255,255,255,0.35)"/>
        <rect x="160" y="190" width="480" height="150" rx="24" fill="rgba(255,255,255,0.18)"/>
        <text x="400" y="260" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" font-weight="700">Foto ${index + 1}</text>
        <text x="400" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#ffffff">${title}</text>
      </svg>
    `;

    const dataUri = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

    return {
      albumId: 1,
      id: index + 1,
      title,
      url: dataUri,
      thumbnailUrl: dataUri,
    };
  });

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getAlbumsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/albums`);
  }

  getPhotosByAlbum(albumId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/albums/${albumId}/photos`).pipe(
      catchError(() => of(this.fallbackPhotos.map((photo) => ({ ...photo, albumId }))))
    );
  }
}