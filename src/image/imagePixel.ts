/**
 *  @file   imagePixel.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Image pixel inherited from Image
 *
 */

import { Image } from "./image";
import * as Jimp from "jimp";
import { DbCommunication } from "../dbCommunication";

const PNG_HEADER = "data:image/png;base64,"


export class ImagePixel extends Image{

    private pixels: any;
    /**
    * Constructor
    *
    * @class ImagePixel
    * @method constructor
    */
    constructor(visibility: string, name: string, author: string, date: string, dateModified: string, protection: string, password: string, editingStyle: string, mode: string, status: string){
        super(visibility, name, author, date, dateModified, protection, password, editingStyle, mode, status);
        this.pixels = null;
    }

  /**
     * Get pixel
     *
     * @class ImagePixel
     * @method getUsername
     * @returns pixel
     */
    public getPixel(): any{
        return this.pixels;
    }

      /**
     * Set pixel
     *
     * @class ImagePixel
     * @method setPixel
     * @param pixel
     */
    public setPixel(pixels:any){
        this.pixels = pixels;
        
    }
  /**
     * Stack one image on another
     *
     * @class imagePixel
     * @method mergePixel
     * @param pixel
     * @param clientSocket
     */
    public mergePixel(pixels: any, socket:any){
       
      let images: Buffer [] = [];
      let jimps: any[] = [];

      images.push(this.pixels);
      images.push(Buffer.from(pixels.image,'base64'));
      this.emitInfo('updatePixel', pixels, socket)
        let self = this;
      for(let image of images){
          jimps.push(Jimp.read(image));
      }
      Promise.all(jimps).then(function(data) {
        return Promise.all(jimps);
      }).then(function(data:Jimp[]) {
        data[0].composite(data[1],0,0);
        
        data[0].getBuffer(Jimp.MIME_PNG,(err:any,buffer:Buffer)=>{
            self.setPixel(buffer);
            pixels.image = buffer.toString('base64');
            DbCommunication.getInstance().updatePixel(self);
            console.log("Merge Success")
            //self.emitInfo('updatePixel', pixels, socket)
        });
      });
    }
}