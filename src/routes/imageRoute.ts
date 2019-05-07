/**
 *  @file   imageRoutes.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Image Http request
 *
 */
import * as express from "express";
import { ImageManager } from '../image/imageManager'
import { ImageManagerUtils } from "../image/imageManagerUtils"
import { Image } from "../image/image";
import { MongooseDocument, Mongoose } from "mongoose";
import * as mongoose from 'mongoose'
import { DbCommunication } from "../dbCommunication";
import { ImageLayer } from "../image/imageLayer";
import { ImagePixel } from "../image/imagePixel";
import { LoginManager } from "../login/loginManager";

const MAX_USERS = 4;
export class ImageRoute {

    private router: express.Router;
    private static instance: ImageRoute;
    /**
       * Constructor
       *
       * @class ImageRoute
       * @method constructor
       */
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    /**
     * Static method in order to be use as a singleton (pattern) for implementing a unique imageRoute.
     *
     * @class ImageRoute
     * @method getInstance
     * @return {SocketManager.instance} Returns the socket manager instance.
     */
    static getInstance(): ImageRoute {

        if (!ImageRoute.instance) {
            this.instance = new ImageRoute();
        }
        return this.instance;
    }
    /**
         * Http request
         *
         * @class Image Route
         * @method routes
         */
    public routes() {
        this.router.post("/edit", (req, res) => {

            let info = req.body;

            let image = ImageManagerUtils.findImage(ImageManager.getInstance().getImages(), info.author, info.title);

            if (image.getUsers().length >= MAX_USERS) {
                res.send(true);
            }
            else {
                res.send(false);
            }

        })

        this.router.get("/download", (req, res) => {


            let images = ImageManager.getInstance().getImages();
            let image = ImageManagerUtils.findImage(images, req.query.author, req.query.title);
            let formatLayers = [];



            if (image != undefined && image instanceof ImageLayer) {

                let layers = image.getLayers();


                for (let layer of layers) {
                    formatLayers.push(image.formatLayer(layer));
                }
                res.send(formatLayers);
            }
            else if (image != undefined && image instanceof ImagePixel) {

                let pixels = null;
                if (image.getPixel() != null) {
                    pixels = image.getPixel().toString('base64');
                }
                let object = {
                    "image": pixels,
                    "title": image.getName(),
                    "author": image.getAuthor(),
                }
                res.send(object);
            }

            else {
                res.send(false);
                console.log("Image not found");
            }


        });



        this.router.post("/create", (req, res) => {

            let infoImage = req.body;

            let images = ImageManager.getInstance().getImages();
            if (!ImageManagerUtils.containsImage(images, infoImage.author, infoImage.title)) {

                let newImage: Image;
                if (infoImage.editingStyle === "Strokes") {
                    newImage = new ImageLayer(infoImage.visibility, infoImage.title, infoImage.author, ImageManagerUtils.getDate(), ImageManagerUtils.getDate(), infoImage.protection, infoImage.password, infoImage.editingStyle, infoImage.mode, "Open for Edition");
                    ImageManager.getInstance().addImage(newImage);
                }
                else if (infoImage.editingStyle === "Pixels") {
                    newImage = new ImagePixel(infoImage.visibility, infoImage.title, infoImage.author, ImageManagerUtils.getDate(), ImageManagerUtils.getDate(), infoImage.protection, infoImage.password, infoImage.editingStyle, infoImage.mode, "Open for Edition");
                    ImageManager.getInstance().addImage(newImage);
                }


                infoImage.creationDate = newImage.getDate();
                infoImage.lastModified = newImage.getDateModified();
                infoImage.status = newImage.getStatus();

                DbCommunication.getInstance().findImageByName(newImage.getName(), (name: mongoose.Document) => {
                    if (name === null) {
                        DbCommunication.getInstance().saveImage(newImage);
                        console.log("Image has been created");

                        ImageManager.getInstance().broadcastImage(infoImage);

                        res.send(true);
                    }
                    else {
                        console.log("Image failed");
                        res.send(false);
                    }
                })
            }
            else {
                res.send(false);
            }

        });

        this.router.post('/updatePixel', (req, res) => {

            let infoPixel = req.body;

          
            let image = ImageManagerUtils.findImage(ImageManager.getInstance().getImages(), infoPixel.author, infoPixel.title);
           
            if (image instanceof ImagePixel) {

                image.setPixel(Buffer.from(infoPixel.image, 'base64'));
                DbCommunication.getInstance().updatePixel(image);
                let socket = LoginManager.getInstance().findSocketByUsername(infoPixel.username);

                let object = {
                    "author": infoPixel.author,
                    "title": infoPixel.title,
                    "image": image.getPixel().toString('base64')
                }
               
                image.emitInfo('updatePixel', object, socket);
                res.send(true);
            }
            else {
                res.send(false);
            }



        })
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