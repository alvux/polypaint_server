/**
 *  @file    dbCommunication.ts
 *  @author  Alexandre Vu et Eric Marchi
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Request to the database
 *
 */
import * as mongoose from 'mongoose';
import loginModel from './Schemas/login';
import imagesModel from './Schemas/images'
import { Image } from './image/image';
import images from './Schemas/images';
import favoritesModel from './Schemas/favorite';
import { ImageManager } from './image/imageManager';
import { LayerSection } from './image/layerSection';
import { Layer } from './image/layer';
import { Favorite } from './image/favorites';
import { FavoriteManager } from './image/favoritesManager';
import { ImageLayer } from './image/imageLayer';
import { ImagePixel } from './image/imagePixel';

export class DbCommunication {

    private static instance: DbCommunication;
    constructor() {
        this.connection();
    }

    static getInstance(): DbCommunication {

        if (!DbCommunication.instance) {
            this.instance = new DbCommunication();
        }
        return this.instance;
    }
        /**
     *Connect to mongoose database
     *
     * @class Dbcommunication
     * @method connection
     */
    public connection(): void {
        mongoose.connect("mongodb://equipe20:equipe20@ds235778.mlab.com:35778/projet3-db");

        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
            console.log("We are connected to the database");
        });
    }
    /**
     * Save a user to db
     *
     * @class DbCommunication
     * @method saveUser
     * @param username
     * @param password 
     */
    public saveUser(username: string, password: string): void {
        let newUser = new loginModel({ username: username, password: password });
        newUser.save();
    }
 /**
     * Find a user to db
     *
     * @class DbCommunication
     * @method findUser
     * @param username
     * @param callback
     */
    public findUser(username: string, callback: any): void {

        let query = loginModel.findOne({ 'username': username });

        query.exec((err, user) => {
            callback(user);
        });
    }
 /**
     * Save an image to DB
     *
     * @class DbCommunication
     * @method saveImage
     * @param image
     */
    public saveImage(image: Image): void {
     
        if (image instanceof ImageLayer) {

            let newimage = new imagesModel({
                // users: [{ username: image.getUsers().keys }],
                layers: image.getLayers(),
                visibility: image.getVisibility(),
                name: image.getName(),
                author: image.getAuthor(),
                date: image.getDate(),
                dateModified: image.getDateModified(),
                protection: image.getProtection(),
                password: image.getPassword(),
                editingStyle: image.getEditingStyle(),
                mode: image.getMode(),
                status: image.getStatus(),
                thumbnail: image.getThumbnail(),
                ratings: image.getRatings()
            });
            newimage.save();
        }

        else if (image instanceof ImagePixel) {
            let newimage = new imagesModel({
                // users: [{ username: image.getUsers().keys }],
                pixels: image.getPixel(),
                visibility: image.getVisibility(),
                name: image.getName(),
                author: image.getAuthor(),
                date: image.getDate(),
                dateModified: image.getDateModified(),
                protection: image.getProtection(),
                password: image.getPassword(),
                editingStyle: image.getEditingStyle(),
                mode: image.getMode(),
                status: image.getStatus(),
                thumbnail: image.getThumbnail(),
                ratings: image.getRatings()
            });
            newimage.save();
        }
    }
 /**
     * Find an image by name from DB
     *
     * @class DbCommunication
     * @method findImageByName
     * @param namePhoto
     * @param callback
     */
    public findImageByName(namePhoto: string, callback: any): void {

        let query = imagesModel.findOne({ 'name': namePhoto });
        query.exec((err, name) => {
            callback(name);
        });
    }
 /**
     * UpdateThumbnail
     *
     * @class DbCommunication
     * @method updateThumbnail
     * @param imageUpdate
     * @param callback
     */
    public updateThumbnail(imageUpdate: Image, callback: any) {

        //console.log(imageUpdate.getThumbnail());
        let query = imagesModel.findOneAndUpdate({ name: imageUpdate.getName() }, {
            $set: {
                thumbnail: imageUpdate.getThumbnail()
            }
        });
        query.exec((err, image) => {
            callback(image);
        })
    }

    /**
     * Update a layer in image
     *
     * @class DbCommunication
     * @method updateLayer
     * @param imageUpdate
     * @param callback
     */
    public updateLayerImage(imageUpdate: ImageLayer, callback: any): void {
        //let query = loginModel.findOne({ 'name': image.getName() });

        let query = imagesModel.findOneAndUpdate({ name: imageUpdate.getName() }, {

            $set: {
                layers: imageUpdate.getLayers(),
                dateModified: imageUpdate.getDateModified(),
            }

        });

        query.then((image) => {

        }).catch((err)=>{
            console.log("error");
        });
      
    };

     /**
     * Update a pixel image
     *
     * @class DbCommunication
     * @method updatePixel
     * @param image

     */

    public updatePixel(image: ImagePixel): void {

        let query = imagesModel.findOneAndUpdate({ name: image.getName() }, {

            $set: {  
                pixels: image.getPixel(),
                dateModified: image.getDateModified(),
               
            }
        });
        query.exec((err, image) => {
        });
    }

     /**
     * Update image setting
     *
     * @class DbCommunication
     * @method updateSettingsImage
     * @param imageUpdate

     */
    public updateSettingsImage(imageUpdate: Image, callback: any): void {
        let query = imagesModel.findOneAndUpdate({ name: imageUpdate.getName() }, {
            $set: {
                visibility: imageUpdate.getVisibility(),
                author: imageUpdate.getAuthor(),
                date: imageUpdate.getDate(),
                dateModified: imageUpdate.getDateModified(),
                protection: imageUpdate.getProtection(),
                password: imageUpdate.getPassword(),
                editingStyle: imageUpdate.getEditingStyle(),
                mode: imageUpdate.getMode()
            }
        });
        query.exec((err, image) => {
            callback(image);
        });
    };
 /**
     * Update rating DB
     *
     * @class DbCommunication
     * @method updateRating
     * @param imageUpdate

     */
    public updateRatings(imageUpdate: Image, ): void {
        let query = imagesModel.findOneAndUpdate({ name: imageUpdate.getName() }, {
            $set: { ratings: imageUpdate.getRatings() }
        });
        query.exec((err, image) => {
            // callback(image);
        });
    };

     /**
     * Update status Image
     *
     * @class DbCommunication
     * @method updateStatusImage
     * @param imageUpdate

     */
    public updateStatusImage(imageUpdate: Image, callback: any): void {
        let query = imagesModel.findOneAndUpdate({ name: imageUpdate.getName() }, {
            $set: { status: imageUpdate.getStatus() }
        });
        query.exec((err, image) => {
            callback(image);
        });
    };

     /**
     * Update users Image
     *
     * @class DbCommunication
     * @method updateUsersImage
     * @param imageUpdate

     */
    public updateUsersImage(imageUpdate: Image, newUsers: string[], callback: any): void {

        let query = imagesModel.findOneAndUpdate({ name: imageUpdate.getName() }, {
            $set: {
                users: [{ username: newUsers }],
                status: imageUpdate.getStatus()
            }
        });
        query.exec((err, image) => {
            callback(image);
        });
    };

    
     /**
     * Remove an Image
     *
     * @class DbCommunication
     * @method removeImage
     * @param name

     */
    public removeImage(name: string): void {

        let query = imagesModel.remove({ 'name': name });
    }

       /**
     * Download all images
     *
     * @class DbCommunication
     * @method downloadImages
   

     */
    public downloadImages() {
        let query = imagesModel.find({})
        query.exec((err, image) => {
            for (let i = 0; i < image.length; i++) {
                if (image[i].get('editingStyle') === "Strokes") {
                    let imageNew = new ImageLayer(
                        image[i].get('visibility'),
                        image[i].get("name"),
                        image[i].get('author'),
                        image[i].get('date'),
                        image[i].get('dateModified'),
                        image[i].get('protection'),
                        image[i].get('password'),
                        image[i].get('editingStyle'),
                        image[i].get('mode'),
                        image[i].get('status')
                    )

                    imageNew.setRatings(image[i].get('ratings'))
                    if (image[i].get('thumbnail') != null) {
                        imageNew.setThumbnail(image[i].get('thumbnail').buffer);
                        //console.log(image[i].get('thumbnail').buffer);
                    }
                    let layer = image[i].get("layers")
                    //  let layer = layers[0].get("layer")
                    for (let j = 0; j < layer.length; j++) {
                        let newLayer = new Layer()
                        // console.log(layer[j])
                        newLayer.setUsername(layer[j].username)
                        newLayer.setWidth(layer[j].lineWidth)
                        newLayer.setId(layer[j].id)
                        newLayer.setProtected(false, "")
                       
                        let color = layer[j].color
                        newLayer.setColor(color.red, color.green, color.blue)

                        let layerSections = layer[j].layerSections
                        for (let k = 0; k < layerSections.length; k++) {
                            let firstPoint = layerSections[k].firstPoint
                            let secondPoint = layerSections[k].secondPoint
                            newLayer.addLayerSection(firstPoint.x, firstPoint.y,
                                secondPoint.x, secondPoint.y)

                        }
                        imageNew.appendLayer(newLayer)
                    }

                    ImageManager.getInstance().addImage(imageNew)
                }
                else {
                    if (image[i].get('editingStyle') === "Pixels") {
                        let imageNew = new ImagePixel(
                            image[i].get('visibility'),
                            image[i].get("name"),
                            image[i].get('author'),
                            image[i].get('date'),
                            image[i].get('date'),
                            image[i].get('protection'),
                            image[i].get('password'),
                            image[i].get('editingStyle'),
                            image[i].get('mode'),
                            image[i].get('status')
                        )
                        imageNew.setRatings(image[i].get('ratings'))
                        if (image[i].get('thumbnail') != null) {
                            imageNew.setThumbnail(image[i].get('thumbnail').buffer);
                            //console.log(image[i].get('thumbnail').buffer.length);
                        }


                        if (image[i].get('pixels') != null) {
                            imageNew.setPixel(image[i].get('pixels').buffer);
                        }
                        // console.log(image[i].get('pixels'))
                        ImageManager.getInstance().addImage(imageNew)
                    }
                }
            }
                     console.log("Download finish")
        });
    }

       /**
     * Save FAvorite in DB
     *
     * @class DbCommunication
     * @method saveFavorite
     * @param favorite

     */
    public saveFavorite(favorite: Favorite): void {

        let newFavorite = new favoritesModel({ "username": favorite.getUsername(), "title": favorite.getTitle(), "author": favorite.getAuthor() })
        newFavorite.save();

    }
  /**
     * Remove FAvorite from DB
     *
     * @class DbCommunication
     * @method removeFavorite
     * @param favorite

     */
    public removeFavorite(favorite: Favorite): void {
        let deleteFavorite = new favoritesModel({ "username": favorite.getUsername(), "title": favorite.getTitle(), "author": favorite.getAuthor() })
        favoritesModel.findOneAndRemove({ 'username': favorite.getUsername(), 'title': favorite.getTitle(), 'author': favorite.getAuthor() }).exec();


    }
 /**
     * Download favorite from DB
     *
     * @class DbCommunication
     * @method downloadFavorite
     * 

     */
    public downloadFavorite(): void {

        let query = favoritesModel.find();

        query.exec((err, favorites) => {

            for (let i = 0; i < favorites.length; i++) {

                let favorite = new Favorite(favorites[i].get("username"), favorites[i].get("title"), favorites[i].get("author"));

                FavoriteManager.getInstance().loadFavorite(favorite);
            }

        })
    }

}