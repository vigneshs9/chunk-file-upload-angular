
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const API_URL = 'http://localhost:3000';

export interface UploadCompleteResponse {
 message: string;
 fileName: string;
 url: string;
}

@Injectable({
 providedIn: 'root'
})
export class FileUploadService {
 private readonly http = inject(HttpClient)


uploadChunk(
  formData: FormData,
  onProgress: (loaded: number, total: number) => void
): Promise<void> {
  const request = new HttpRequest(
    'POST',
    `${API_URL}/upload/chunk`,
    formData,
    { reportProgress: true }
  );

  return new Promise<void>((resolve, reject) => {
    let responseReceived = false;

    this.http.request(request).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress) {
          console.log(
            'Uploaded bytes:',
            event.loaded,
            'Total bytes:',
            event.total
          );

          onProgress(event.loaded, event.total ?? 0);
        }

        if (event.type === HttpEventType.Response) {
          responseReceived = true;

          if (event.status >= 200 && event.status < 300) {
            resolve();
          } else {
            reject(new Error('Chunk upload failed'));
          }
        }
      },

      error: error => {
        console.error('Chunk upload error:', error);
        reject(error);
      },

      complete: () => {
        if (!responseReceived) {
          reject(new Error('No server response received'));
        }
      }
    });
  });
}


 completeUpload(fileId: string, originalName: string, totalChunks: number): Promise<UploadCompleteResponse> {
  return firstValueFrom(this.http.post<UploadCompleteResponse>(`${API_URL}/upload/complete`, { fileId, originalName, totalChunks }));
 }

 getFileUrl(relativeUrl: string): string {
  return `${API_URL}${relativeUrl}`;
 }
}
