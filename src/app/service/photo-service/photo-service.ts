import {
  Plugins, CameraResultType, Capacitor, FilesystemDirectory,
  CameraPhoto, CameraSource
} from '@capacitor/core';

const { Camera } = Plugins;

export class PhotoService {

  private static instance: PhotoService;

  constructor() {

  }

  /**
   * Singleton
   */
  public static getInstance(): PhotoService {

    if (!PhotoService.instance) {
      PhotoService.instance = new PhotoService();
    }

    return PhotoService.instance;
  }

  public async takePhoto(): Promise<CameraPhoto> {
    // Take a photo
    let capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 100
    });
    return capturedPhoto;
  }
}