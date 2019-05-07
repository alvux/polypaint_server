/**
 *  @file   gallery.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * HTTP request for gallery
 *
 */
import * as express from "express";
import { ImageManager } from '../image/imageManager'
import { ImageManagerUtils } from "../image/imageManagerUtils"
import { Image } from "../image/image";
import { DbCommunication } from "../dbCommunication";
import * as mongoose from 'mongoose';
import { FavoriteManager } from '../image/favoritesManager';
import { Favorite } from "../image/favorites";
import { ImageLayer } from "../image/imageLayer";
import { Layer } from "../image/layer";
import { ImagePixel } from "../image/imagePixel";
import { LoginManager } from "../login/loginManager";

export class GalleryRoute {

    private router: express.Router;
    private static instance: GalleryRoute;

    /**
     * Constructor
     *
     * @class Gallery
     * @method constructor
     */
    constructor() {
        this.router = express.Router();
        this.routes();
    }
      /**
     * Static method in order to be use as a singleton (pattern) for implementing a unique Connection.
     *
     * @class Gallery
     * @method getInstance
     * @return {SocketManager.instance} Returns the socket manager instance.
     */
    static getInstance(): GalleryRoute {

        if (!GalleryRoute.instance) {
            this.instance = new GalleryRoute();
        }
        return this.instance;
    }
    /**
     * Http request
     *
     * @class Gallery
     * @method routes
     */
    public routes() {

        this.router.get("/download", (req, res) => {
            let images = ImageManager.getInstance().getImages();
            let imagesInfo = []
            let username = req.query.username;
            console.log(username);
            for (let image of images) {

                    let object = {
                        "visibility": image.getVisibility(),
                        "title": image.getName(),
                        "author": image.getAuthor(),
                        "creationDate": image.getDate(),
                        "lastModified": image.getDateModified(),
                        "protection": image.getProtection(),
                        "password": image.getPassword(),
                        "editingStyle": image.getEditingStyle(),
                        "mode": image.getMode(),
                        "status": image.getStatus(),
                        "rating": image.averageRating(),
                        "users": LoginManager.getInstance().getUsernamesFromSocket(image.getUsers())
                    }
                    imagesInfo.push(object);
                

            }

            res.send(imagesInfo);


        })

        this.router.get("/thumbnails", (req, res) => {

            let images = ImageManager.getInstance().getImages();
            let imagesInfo = []
            for (let image of images) {

                if (image.getThumbnail() !== null) {

                    let object = {
                        "image": image.getThumbnail().toString('base64'),
                        "title": image.getName(),
                        "author": image.getAuthor(),
                    }
                    imagesInfo.push(object);
                }
            }

            res.send(imagesInfo);
        })

        this.router.post('/favorites/add', (req, res) => {

            let info = req.body;
            let newFavorite = new Favorite(info.username, info.title, info.author);
            FavoriteManager.getInstance().addFavorite(newFavorite);
            res.send(true);
        });

        this.router.post('/favorites/remove', (req, res) => {

            let info = req.body;
            let newFavorite = new Favorite(info.username, info.title, info.author);
            FavoriteManager.getInstance().removeFavorite(newFavorite);
            res.send(true);
        });

        this.router.get('/favorites/download', (req, res) => {

            let username = req.query.username;
            res.send(FavoriteManager.getInstance().getFavoritesWithUsername(username));
        });
        this.router.post('/updateThumbail', (req, res: any) => {


            let infoThumb = req.body;
            let image = ImageManagerUtils.findImage(ImageManager.getInstance().getImages(), infoThumb.author, infoThumb.title);

            if (image != undefined) {
                image.setThumbnail(Buffer.from(infoThumb.image, 'base64'));
                
                DbCommunication.getInstance().updateThumbnail(image, (image: mongoose.Document) => {
                    console.log("Update Thumbnail in DB sucessful");
                })

                infoThumb.image = image.getThumbnail().toString('base64');

                //console.log(infoThumb.image);
                ImageManager.getInstance().getSockerServer().emit('updateThumbnail', infoThumb);
                res.send(true);
            }
            else {
                console.log("Thumbnail error");
                res.send(false);
            }


        });

        // triggered
        this.router.post('/upload/layers', (req, res) => {
            let info = req.body; 
            let layers = req.body.layers;

            let image = ImageManagerUtils.findImage(ImageManager.getInstance().getImages(), info.author, info.title);
            if(image != undefined && image instanceof ImageLayer) {
                for(let layer of layers) {
                    image.addLayer(layer, null);
                }
                res.send(true);
            } else {
                res.send(false);
            }


        });

       
      this.router.post('/copy',(req,res)=>{
        let info = req.body;

        let image = ImageManagerUtils.findImage(ImageManager.getInstance().getImages(), info.fromAuthor,info.fromTitle);
        let imageCopy = ImageManagerUtils.findImage(ImageManager.getInstance().getImages(), info.toAuthor,info.toTitle);

        if(image != undefined && image instanceof ImageLayer && imageCopy != undefined && imageCopy instanceof ImageLayer){

            for(let layer of image.getLayers()){
                let formatLayer = image.formatLayer(layer);
                imageCopy.addLayer(formatLayer,null);

            }

            imageCopy.setThumbnail(image.getThumbnail());
            let thumbnail = null;
            if(image.getThumbnail() != null){
                thumbnail = imageCopy.getThumbnail().toString('base64');
            }

            let object = {
                "author": imageCopy.getAuthor(),
                "title": imageCopy.getName(),
                "image": thumbnail
            }

            ImageManager.getInstance().getSockerServer().emit('updateThumbnail', object);

            res.send(true);
        }
        else if(image != undefined && image instanceof ImagePixel && imageCopy != undefined && imageCopy instanceof ImagePixel){

            imageCopy.setThumbnail(image.getThumbnail());
            let pixels = image.getPixel();
            imageCopy.setPixel(pixels);

            let thumbnail = null;
            if(imageCopy.getThumbnail() != null){
                thumbnail = imageCopy.getThumbnail().toString('base64');
            }

            let object = {
                "author": imageCopy.getAuthor(),
                "title": imageCopy.getName(),
                "image": thumbnail
            }

            ImageManager.getInstance().getSockerServer().emit('updateThumbnail', object);

            res.send(true);
        }
      }
    )


    }
 /**
     * get express router
     *
     * @class Gallery
     * @method getRouter
     */
    public getRouter(): express.Router {
        return this.router;
    }
}