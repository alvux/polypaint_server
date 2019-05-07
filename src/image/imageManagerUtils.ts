/**
 *  @file   imageManagerUtils.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Image utilities
 *
 */
import { Image } from "./image";

export class ImageManagerUtils {
  /**
     * Handle updateRating event
     *
     * @class ImageManagerUtils
     * @method containsImage
     * @param images list of images
     * @param author Image author
     * @param name Image name
     * @returns boolean indicating if the image is in memory
     * 
     */
    public static containsImage(images: Image[], author: string, name: string): boolean {


        for (let image of images) {

            if (image.getAuthor() === author && image.getName() === name) {
                return true;
            }
        }
        return false;
    }


 /**
     * Find image object
     *
     * @class ImageManagerUtils
     * @method findImage
     * @param images list of images
     * @param author Image author
     * @param name Image name
     * @returns Image object
     * 
     */
    public static findImage(images: Image[], author: string, name: string): Image {


        for (let image of images) {

            if (image.getAuthor() === author && image.getName() === name) {
               // console.log(image);
                return image;
            }
        }
        return undefined;
    }

    /**
     * Get the current date
     *
     * @class ImageManagerUtils
     * @method getDate
     * @returns current date in string
     * 
     */
    public static getDate(): string {
        let date = new Date();
        return date.toLocaleString();
    }
  /**
     * Find image with socket
     *
     * @class ImageManagerUtils
     * @method getImageWithSocket
     * @param images list of current images
     * @param userSocket client socket
     * @returns image object
     * 
     */
    public static getImageWithSocket(images: Image[], userSocket: any): Image {
        for (let image of images) {
            
                let users = image.getUsers();

                for (let socket of users) {
                    if (socket.id === userSocket.id) {
                        return image;
                    }

                }

            

        }
        return undefined;
    }
}