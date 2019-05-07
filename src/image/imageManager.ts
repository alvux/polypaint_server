/**
 *  @file   imageManager.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Manage the socket event receive from the client
 *
 */

import * as io from "socket.io";
import { Image } from "./image";
import { ImageManagerUtils } from "./imageManagerUtils"
import { userInfo } from "os";
import { DbCommunication } from "../dbCommunication";
import * as mongoose from 'mongoose';
import { ImageLayer } from "./imageLayer";
import { LoginManager } from "../login/loginManager";
import { ImagePixel } from "./imagePixel";


export class ImageManager {


    private socketServer: SocketIO.Server;
    // private image: Image = new Image("", "", "", "", "", "", "", "","","");
    private static instance: ImageManager;
    private images: Image[] = [];


 /**
     * Constructor
     *
     * @class ImageManager
     * @method constructor
     */
    constructor() {

    }
  /**
     * Static method in order to be use as a singleton (pattern) for implementing a unique FavoriteManager.
     *
     * @class ImageManager
     * @method getInstance
     * @return {SocketManager.instance} Returns the socket manager instance.
     */
    static getInstance(): ImageManager {
        if (!ImageManager.instance) {
            ImageManager.instance = new ImageManager();

        }

        return ImageManager.instance;
    }

      /**
     * Initialize socket class method
     *
     * @class ImageManager
     * @method init
     * @param socketServer
     * @param socket
     * 
     */
    public init(socketServer: SocketIO.Server, socket: any): void {

        this.socketServer = socketServer;
        this.addLayer(socket);
        this.joinImage(socket);
        this.replaceLayer(socket);
        this.removeLayer(socket);
        this.clearImage(socket);
        this.changeImageSetting(socket);
        this.completeImage(socket);
        this.leaveImageSocket(socket);
        this.lassoSelect(socket);
        this.updateThumbnail(socket);
        this.updateRating(socket);
        this.updatePixel(socket);
    }
 /**
     * Handle updatePixel event
     *
     * @class ImageManager
     * @method init
     * @param socket Client socket
     * 
     */
    public updatePixel(socket: any) {
        socket.on('updatePixel', (info: any) => {
           let infoPixel = JSON.parse(info);
          //  let infoPixel = info;
            let image = ImageManagerUtils.findImage(this.images, infoPixel.author, infoPixel.title);

            if (image instanceof ImagePixel) {
                if(image.getPixel() === null){
                    image.setPixel(Buffer.from(infoPixel.image, 'base64'));
                    DbCommunication.getInstance().updatePixel(image);
                    image.emitInfo('updatePixel', infoPixel, socket);
                }
                else {
                    image.mergePixel(infoPixel,socket);
                }
              

            }
        })
    }
     /**
     * Handle updateRating event
     *
     * @class ImageManager
     * @method updateRating
     * @param socket Client socket
     * 
     */
    public updateRating(socket: any): void {

        socket.on('updateRating', (info: any) => {
            let infoRating = JSON.parse(info);
            let image = ImageManagerUtils.findImage(this.images, infoRating.author, infoRating.title);

            if (image != undefined) {
                let object = {
                    "author": infoRating.author,
                    "title": infoRating.title,
                    "rating": image.updateRating(infoRating)
                }
                this.socketServer.emit('updateRating', object);
            }
            else {
                console.log('update error');
            }
        })

    }

    /**
     * Handle thumbnail update event
     *
     * @class ImageManager
     * @method updateThumbnail
     * @param socket Client socket
     * 
     */
    public updateThumbnail(socket: any): void {
        socket.on('updateThumbnail', (info: any) => {

            let infoThumb = info;
            let image = ImageManagerUtils.findImage(this.images, infoThumb.author, infoThumb.title);

            if (image != undefined) {
                image.setThumbnail(Buffer.from(infoThumb.image, 'base64'));
                DbCommunication.getInstance().updateThumbnail(image, (image: mongoose.Document) => {
                    console.log("Update Thumbnail in DB sucessful");
                })
                this.socketServer.emit('updateThumbnail', infoThumb);
            }
            else {
                console.log("Thumbnail error");
            }


        })
    }

      /**
     * Complete image socket event
     *
     * @class ImageManager
     * @method completeImage
     * @param socket Client socket
     * 
     */
    public completeImage(socket: any): void {
        socket.on('completeImage', (info: any) => {
            let infoObject = JSON.parse(info);
            let image = ImageManagerUtils.findImage(this.images, infoObject.author, infoObject.title);

            image.setStatus('Completed');

            this.socketServer.emit('completeImage', infoObject);
            DbCommunication.getInstance().updateStatusImage(image, (image: mongoose.Document) => { })
        })
    }

    /**
     * Handle change setting update
     *
     * @class ImageManager
     * @method changeImageSetting
     * @param socket Client socket
     * 
     */
    public changeImageSetting(socket: any): void {
        socket.on('changeImageSettings', (info: any) => {

            let infoObject = JSON.parse(info);
            let image = ImageManagerUtils.findImage(this.images, infoObject.author, infoObject.title);

            image.setPassword(infoObject.password);
            image.setVisibility(infoObject.visibility);
            image.setProtection(infoObject.protection);

            let infoImage = {
                "visibility": image.getVisibility(),
                "title": image.getName(),
                "author": image.getAuthor(),
                "lastModified": image.getDateModified(),
                "protection": image.getProtection(),
                "password": image.getPassword(),
                "status": image.getStatus()

            }

            this.socketServer.emit("updateImage", infoImage);
            DbCommunication.getInstance().updateSettingsImage(image, (image: mongoose.Document) => { })

        })
    }

    /**
     * Join image socket event
     *
     * @class ImageManager
     * @method joinImage
     * @param socket Client socket
     * 
     */
    public joinImage(socket: any): void {
        socket.on('joinImage', (info: any) => {

            let infoObject = JSON.parse(info);

            let imageIndex = this.images.indexOf(ImageManagerUtils.findImage(this.images, infoObject.author, infoObject.title));
            console.log("aa");
            if (imageIndex > -1) {
                this.images[imageIndex].addUser(socket);
                if (this.images[imageIndex].getVisibility() === "Public") {

                    this.images[imageIndex].setStatus("Being Edited");
                }
                else {
                    this.images[imageIndex].setStatus("Open for Edition");
                }
                
                console.log(this.images[imageIndex].getStatus());
                let infoImage = {
                    "visibility": this.images[imageIndex].getVisibility(),
                    "title": this.images[imageIndex].getName(),
                    "author": this.images[imageIndex].getAuthor(),
                    "lastModified": this.images[imageIndex].getDateModified(),
                    "protection": this.images[imageIndex].getProtection(),
                    "password": this.images[imageIndex].getPassword(),
                    "status": this.images[imageIndex].getStatus(),
                    "users": LoginManager.getInstance().getUsernamesFromSocket(this.images[imageIndex].getUsers())
    
                }
                console.log(infoImage);
                this.socketServer.emit("updateImage", infoImage);
            }
            else {
                console.log("Error join Image")
            }

        });
    }
   /**
     * Leave image socket event
     *
     * @class ImageManager
     * @method leaveImageSocket
     * @param socket Client socket
     * 
     */
    public leaveImageSocket(socket: any): void {
        socket.on('leaveImage', (info: any) => {
            this.leaveImage(socket);
        })
    }
 /**
     * Remove a user from an image and updateImage
     *
     * @class ImageManager
     * @method leaveImage
     * @param socket Client socket
     * 
     */
    public leaveImage(socket: any) {
        let image = ImageManagerUtils.getImageWithSocket(this.images, socket);
        if(image != undefined)
            image.setDateModified(ImageManagerUtils.getDate());


        let indexImage = this.images.indexOf(image);
        if (image != undefined && indexImage > -1) {
            this.images[indexImage].removeUser(socket);
            let infoImage = {
                "visibility": image.getVisibility(),
                "title": image.getName(),
                "author": image.getAuthor(),
                "lastModified": image.getDateModified(),
                "protection": image.getProtection(),
                "password": image.getPassword(),
                "status": image.getStatus(),
                "users": LoginManager.getInstance().getUsernamesFromSocket(image.getUsers())

            }

            console.log(image.getStatus());
            if (image instanceof ImageLayer) {
                image.releaseLayer(socket);
            }
            this.socketServer.emit("updateImage", infoImage);
        }

        else {
            console.log("Leave image error");
        }

    }

     /**
     * Add an image in memory
     *
     * @class ImageManager
     * @method addImage
     * @param socket Client socket
     * 
     */
    public addImage(image: Image) {
        this.images.push(image);
    }
    /**
     * addLayer socket event
     *
     * @class ImageManager
     * @method addLayer
     * @param socket Client socket
     * 
     */
    public addLayer(socket: any): void {
        socket.on('addLayer', (info: any) => {
            let image = ImageManagerUtils.getImageWithSocket(this.images, socket);
            let indexImage = this.images.indexOf(image);
            // console.log(indexImage);
            if (image !== undefined && indexImage > -1 && image instanceof ImageLayer)
                image.addLayer(JSON.parse(info), socket);
            else
                console.log("Add Layer Error")

        })
    }
 /**
     * Replace a layer socket event
     *
     * @class ImageManager
     * @method replaceLayer
     * @param socket Client socket
     * 
     */
    public replaceLayer(socket: any): void {
        socket.on('replaceLayer', (info: any) => {
            let image = ImageManagerUtils.getImageWithSocket(this.images, socket);
            console.log("Replace");
            let indexImage = this.images.indexOf(image);
            if (image !== undefined && indexImage != -1 && image instanceof ImageLayer)
                image.replaceLayer(JSON.parse(info), socket);
            else
                console.log("Replace Layer Error")
        });
    }

     /**
     * Remove a layer socket event
     *
     * @class ImageManager
     * @method removeLayer
     * @param socket Client socket
     * 
     */
    public removeLayer(socket: any): void {
        socket.on('removeLayer', (info: any) => {
            let image = ImageManagerUtils.getImageWithSocket(this.images, socket);
            console.log("Remove");
            let indexImage = this.images.indexOf(image);
            if (image !== undefined && indexImage != -1 && image instanceof ImageLayer)
                image.removeLayer(JSON.parse(info), socket);
            else
                console.log("Remove Layer Error")
        });
    }
   /**
     * Clear layers socket event
     *
     * @class ImageManager
     * @method clearImage
     * @param socket Client socket
     * 
     */
    public clearImage(socket: any): void {
        socket.on('clear', (info: any) => {

            let image = ImageManagerUtils.getImageWithSocket(this.images, socket);
            if (image instanceof ImageLayer)
                image.clearImage(socket);

            console.log("Clear sucessful");
            // socket.broadcast.emit('clear', "");



        });

    }
/**
     * Lasso socket event
     *
     * @class ImageManager
     * @method lassoSelect
     * @param socket Client socket
     * 
     */
    public lassoSelect(socket: any) {
        socket.on("lassoSelect", (info: any) => {
            let layers = JSON.parse(info);
            console.log(layers);

            let image = ImageManagerUtils.getImageWithSocket(this.images, socket);
            let indexImage = this.images.indexOf(image);
            if (image !== undefined && indexImage != -1 && image instanceof ImageLayer) {
                image.protectLayer(layers, socket);
            }


        })
    }

    /**
     * Broadcast an image to every client
     *
     * @class ImageManager
     * @method broadcastImage
     * @param infoImage
     * 
     */
    public broadcastImage(infoImage: any): void {
        if (infoImage.visibility === "Public") {
            this.socketServer.emit("newImage", infoImage);
        }
        else if (infoImage.visibility === "Private") {
          //  let socket = LoginManager.getInstance().findSocketByUsername(infoImage.author);
          
                this.socketServer.emit('newImage', infoImage);
            
        }



    }

    
    /**
     * Get all images in memory
     *
     * @class ImageManager
     * @method getImages
     * @returns images
     * 
     */
    public getImages(): Image[] {
        return this.images;
    }

     /**
     * Return the server socket
     *
     * @class ImageManager
     * @method getSocketServer
     * @returns socketServer
     * 
     */
    public getSockerServer(): SocketIO.Server {
        return this.socketServer;
    }
    
}