import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

export class ImageStorageService {
  static init() {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  }

  /**
   * Saves a buffer to local disk and returns the relative public URL
   */
  static async saveFile(buffer: Buffer, originalname: string, mimeType: string): Promise<string> {
    this.init();
    const ext = path.extname(originalname) || this.getExtensionFromMime(mimeType) || '.jpg';
    const filename = `food_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    await fs.promises.writeFile(filePath, buffer);
    return `/uploads/${filename}`;
  }

  /**
   * Saves base64 data to local file and returns public URL
   */
  static async saveBase64(base64Data: string, mimeType: string = 'image/jpeg'): Promise<string> {
    this.init();
    const ext = this.getExtensionFromMime(mimeType) || '.jpg';
    const filename = `food_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Strip header if present
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    await fs.promises.writeFile(filePath, buffer);

    return `/uploads/${filename}`;
  }

  private static getExtensionFromMime(mime: string): string {
    switch (mime.toLowerCase()) {
      case 'image/png':
        return '.png';
      case 'image/webp':
        return '.webp';
      case 'image/gif':
        return '.gif';
      case 'image/jpeg':
      case 'image/jpg':
      default:
        return '.jpg';
    }
  }
}
