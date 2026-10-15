/**
 * Cloudinary & Image Upload Utility
 *
 * Uploads an image file to Cloudinary either via the secure server-side route (/api/upload)
 * or via direct client-side unsigned upload if an upload preset is configured.
 */

export interface UploadOptions {
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

export interface UploadResult {
  url: string;
  publicId?: string;
}

export async function uploadImage(
  file: File,
  options?: UploadOptions
): Promise<string> {
  const { onProgress, signal } = options || {};

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // 1. If direct unsigned preset is available, upload directly to Cloudinary
  if (cloudName && uploadPreset) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "rosamystica/blogs");

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      );

      if (signal) {
        signal.addEventListener("abort", () => {
          xhr.abort();
          reject(new Error("Upload aborted"));
        });
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data.secure_url || data.url);
          } catch {
            reject(new Error("Failed to parse Cloudinary response"));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(
              new Error(
                errorData.error?.message ||
                  `Cloudinary upload failed with status ${xhr.status}`
              )
            );
          } catch {
            reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => reject(new Error("Network error during Cloudinary upload"));
      xhr.send(formData);
    });
  }

  // 2. Default: Secure Server-Side Route (/api/upload)
  return new Promise<string>((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    if (signal) {
      signal.addEventListener("abort", () => {
        xhr.abort();
        reject(new Error("Upload aborted"));
      });
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data.url);
        } else {
          reject(
            new Error(
              data.error ||
                `Upload failed (${xhr.status}). Ensure Cloudinary keys are set in .env.local`
            )
          );
        }
      } catch {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () =>
      reject(new Error("Network error occurred while connecting to upload endpoint"));
    xhr.send(formData);
  });
}
