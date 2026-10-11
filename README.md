# Chunk File Upload — Angular

A file upload application built with **Angular 22** that uploads large files in smaller chunks and displays real-time upload progress using Angular Signals.

## 🚀 Features

- 📁 Select files from your local system.
- ✂️ Split large files into smaller chunks of 5 MB.
- 📤 Upload chunks individually to a Node.js backend.
- 📊 Display real-time upload progress from 0% to 100%.
- ⚡ Use Angular Signals for reactive UI updates.
- 🔗 Receive a link to access the uploaded file after successful completion.
- 📱 Responsive user interface for desktop and mobile screens.
- ❌ Display error messages when an upload fails.

## 🛠️ Technologies Used

- Angular 22
- TypeScript
- HTML5
- CSS3
- Angular Signals
- Angular HttpClient
- Node.js and Express backend

## 📂 Project Structure

```text
chunk-file-upload-angular/
├── src/
│   └── app/
│       ├── app.component.ts
│       ├── app.component.html
│       ├── app.component.css
│       ├── file-upload.service.ts
│       └── app.config.ts
├── angular.json
├── package.json
├── package-lock.json
└── README.md
```

## ⚙️ Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Angular CLI compatible with your project
- Git

Check your installed versions:

```bash
node -v
npm -v
ng version
```

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/chunk-file-upload-angular.git
```

### 2. Navigate to the project directory

```bash
cd chunk-file-upload-angular
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the Angular application

```bash
ng serve
```

Open the application in your browser:

http://localhost:4200

## 🔗 Backend Configuration

This frontend requires the Node.js backend to be running.

By default, the application communicates with:

```text
http://localhost:3000
```

The API URL is configured in `src/app/file-upload.service.ts`.

If your backend runs on another host or port, update the API URL accordingly.

The backend must also allow requests from the Angular application's origin.

## 📤 How File Upload Works

1. Select a file using the file input.
2. Click the **Upload File** button.
3. Angular divides the file into chunks of 5 MB.
4. Each chunk is sent to the Node.js backend using an HTTP POST request.
5. Angular tracks HTTP upload progress events.
6. Angular Signals update the progress bar and percentage.
7. After all chunks are uploaded, Angular requests the backend to merge them.
8. When the backend confirms successful completion, the progress reaches 100%.
9. The application displays a link to open the uploaded file.

## 📊 Upload Progress

The overall upload percentage is calculated using the number of bytes uploaded:

```text
Progress (%) = (Uploaded Bytes / Total File Size) × 100
```

The application accounts for completed chunks and the progress of the currently uploading chunk.

The progress is capped at 99% until the backend confirms that the final file has been assembled successfully.

## 🧩 Angular Signals

Signals manage the reactive state of the upload component.

| Signal | Purpose |
|---|---|
| `selectedFile` | Stores the selected file |
| `progress` | Tracks upload progress |
| `isUploading` | Indicates whether an upload is in progress |
| `statusMessage` | Displays the current upload status |
| `errorMessage` | Displays upload errors |
| `uploadedFileUrl` | Stores the URL of the completed file |

Example:

```typescript
progress = signal(0);

// Update the progress
this.progress.set(50);
```

The Angular template automatically updates when the signal value changes.

## 🔌 Backend API Integration

The frontend uses the following endpoints.

### Upload a chunk

```http
POST /upload/chunk
Content-Type: multipart/form-data
```

Form fields:

| Field | Description |
|---|---|
| `fileId` | Unique identifier for the upload |
| `chunkIndex` | Zero-based chunk position |
| `totalChunks` | Total number of chunks |
| `chunk` | Binary data of the current chunk |

### Complete the upload

```http
POST /upload/complete
Content-Type: application/json
```

Example request:

```json
{
  "fileId": "your-upload-id",
  "originalName": "video.mp4",
  "totalChunks": 3
}
```

The backend combines the chunks and returns the completed file's URL.

## ⚠️ Important Notes

- The Node.js backend must be running before uploading files.
- This project uses local server storage rather than cloud storage.
- The current implementation uploads chunks sequentially.
- Resume after a browser refresh, pause, and retry functionality are not implemented.
- Uploaded files are accessible only while the backend server and its storage remain available.
- Configure the correct backend URL before deploying the frontend.
- Do not expose private uploaded files through a public URL without appropriate access controls.

## 🔮 Future Improvements

- Resume interrupted uploads.
- Retry failed chunks automatically.
- Add pause and cancel functionality.
- Support concurrent chunk uploads.
- Display upload speed and estimated remaining time.
- Add authentication and authorization.
- Add file type and file size validation.
- Integrate cloud storage when required.

## 👨‍💻 Author

**Your Name**

GitHub: https://github.com/vigneshs9

## 📄 License

This project is available under the MIT License. Add a `LICENSE` file to the repository if you intend to distribute it under that license.
