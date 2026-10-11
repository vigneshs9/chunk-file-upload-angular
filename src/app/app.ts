import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService } from './file-upload.service';

@Component({
 selector: 'app-root',
 standalone: true,
 imports: [CommonModule],
 templateUrl: './app.html',
 styleUrl: './app.css'
})
export class App {
 selectedFile = signal<File | null>(null);
 progress = signal(0);
 isUploading = signal(false);
 statusMessage = signal('');
 errorMessage = signal('');
 uploadedFileUrl = signal('');

 readonly chunkSize = 5 * 1024 * 1024;
 private readonly fileUploadService = inject(FileUploadService)

 onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;

  if (this.isUploading()) {
   return;
  }

  this.selectedFile.set(file);
  this.progress.set(0);
  this.statusMessage.set('');
  this.errorMessage.set('');
  this.uploadedFileUrl.set('');
 }

 async uploadFile(): Promise<void> {
  const file = this.selectedFile();

  if (!file || this.isUploading()) {
   return;
  }

  this.isUploading.set(true);
  this.progress.set(0);
  this.errorMessage.set('');
  this.uploadedFileUrl.set('');

  try {
   const fileId = crypto.randomUUID();
   const totalChunks = Math.ceil(file.size / this.chunkSize);

   let completedBytes = 0;

   for (let i = 0; i < totalChunks; i++) {
    const start = i * this.chunkSize;
    const end = Math.min(start + this.chunkSize, file.size);

    const chunk = file.slice(start, end);
    const formData = new FormData();

    formData.append('fileId', fileId);
    formData.append('chunkIndex', String(i));
    formData.append('totalChunks', String(totalChunks));
    formData.append('chunk', chunk, file.name);

    this.statusMessage.set(`Uploading chunk ${i + 1} of ${totalChunks}...`);

    await this.fileUploadService.uploadChunk(formData, (loaded, total) => {
     const currentChunkBytes = Math.min(loaded, chunk.size);

     const uploadedBytes = completedBytes + currentChunkBytes;

     this.progress.set(Math.min(99, Math.floor((uploadedBytes / file.size) * 100)));
    }
    );

    completedBytes += chunk.size;
   }

   this.statusMessage.set('Merging chunks on server...');

   const result = await this.fileUploadService.completeUpload(fileId, file.name, totalChunks);
   this.uploadedFileUrl.set(this.fileUploadService.getFileUrl(result.url));
   this.progress.set(100);
   this.statusMessage.set(result.message);
  } catch (error: any) {
   this.errorMessage.set(error?.error?.message || error?.message || 'File upload failed.');
   this.statusMessage.set('Upload failed.');
  } finally {
   this.isUploading.set(false);
  }
 }

 fileSizeInMB(): string {
  const file = this.selectedFile();

  return file ? (file.size / (1024 * 1024)).toFixed(2) : '0';
 }
}
