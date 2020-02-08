import {Injectable} from '@angular/core';
import Unsplash, {toJson} from 'unsplash-js';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  unsplash = new Unsplash({accessKey: '0cd8dc520afcebddb302df021b34acf9779014e145516044b8a64ff67a58fe64'});

  constructor() {
  }

  getImages(searchText, orientation?): Promise<any>  {
    const imageOrination =  (orientation) ? orientation : 'portrait';
    return this.unsplash.search.photos(searchText, 1, 12, {orientation: imageOrination})
      .then(toJson)
      .then(json => json);
  }

  getImagesForSpecificPage(searchText: string, orientation, page): Promise<any>  {
    return this.unsplash.search.photos(searchText, page, 12, {orientation})
      .then(toJson)
      .then(json => json);
  }

  getImage(id): Promise<any> {
    return this.unsplash.photos.getPhoto(id)
      .then(toJson)
      .then(json => json);
  }
}
