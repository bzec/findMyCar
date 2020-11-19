import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, 
    CameraPhoto, CameraSource } from '@capacitor/core';

const { Camera, Filesystem, Storage } = Plugins;

export class PhotoService {

    private static instance : PhotoService;

    constructor(){

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

    public async takePhoto() {
        // Take a photo
        let capturedPhoto = await Camera.getPhoto({
          resultType: CameraResultType.Uri, 
          source: CameraSource.Camera, 
          quality: 100 
        });
        console.log(capturedPhoto);
        return capturedPhoto;
    }
  }