/**
 *  @file   imageLayer.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Image Layer object inherited from Image
 *
 */
import * as io from "socket.io";
import { Layer } from './layer';
import { LayerSection } from './layerSection'
import { DbCommunication } from "../dbCommunication";
import * as mongoose from 'mongoose';
import { Image } from "./image";


export class ImageLayer extends Image {

    private layers: Layer[] = [];

    /**
     * Constructor
     *
     * @class ImageLayer
     * @method constructor
     */
    constructor(visibility: string, name: string, author: string, date: string, dateModified: string, protection: string, password: string, editingStyle: string, mode: string, status: string) {
        super(visibility, name, author, date, dateModified, protection, password, editingStyle, mode, status);
    }
   /**
     * Add a layer to the image
     *
     * @class ImageLayer
     * @method addLayer
     * @param info
     * @param socket
     */
    public addLayer(info: any, socket: any): void {
        let layer = new Layer();

        layer.setColor(info.colors[0], info.colors[1], info.colors[2]);
        layer.setWidth(info.width);

        for (let i = 0; i < info.layerSections.length; i = i + 4) {
            layer.addLayerSection(info.layerSections[i], info.layerSections[i + 1], info.layerSections[i + 2], info.layerSections[i + 3]);
        }

        layer.setId(info.id);
        layer.setUsername(info.username);

        console.log("Layer created");
        this.layers.push(layer);

        let object = this.formatLayer(layer);

        if (socket !== null) {
            this.emitInfo("addLayer", object, socket);
        }

        DbCommunication.getInstance().updateLayerImage(this, (image: mongoose.Document) => { })
    }
/**
     * Load layer from DB
     *
     * @class ImageLayer
     * @method appendLayer
     * @param layer
     */
    public appendLayer(layer: any): void {

        this.layers.push(layer);
    }
/**
     * Find Layer in image
     *
     * @class ImageLayer
     * @method findLayer
     * @param info
     * @return promise
     */
    public findLayer(info: any): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            const result = this.layers.find(function (element): boolean {
                return element.getId() === info.id && element.getUsername() === info.username;

            })
            resolve(result);
        });
        return promise;
    }

    /**
     * Remove layer from image
     *
     * @class ImageLayer
     * @method removeLayer
     * @param info
     * @param socket
     */
    public removeLayer(info: any, socket: any): void {

        let promise = this.findLayer(info);
        promise.then((result: Layer) => {
            if (result !== undefined) {
                let index = this.layers.indexOf(result);
                if (index > -1) {
                    this.layers.splice(index, 1);
                    this.emitInfo("removeLayer", info, socket);
                    DbCommunication.getInstance().updateLayerImage(this, (image: mongoose.Document) => { })
                }
            }
        })
    }

       /**
     * Replace layer from image
     *
     * @class ImageLayer
     * @method replaceLayer
     * @param info
     * @param socket
     */
    public replaceLayer(info: any, socket: any): void {
        let promise = this.findLayer(info);
        promise.then((result: Layer) => {
            if (result !== undefined) {
                let index = this.layers.indexOf(result);
                if (index > -1) {
                    for (let i = info.layers.length - 1; i >= 0; i--) {

                        let layer = new Layer();

                        layer.setColor(info.layers[i].colors[0], info.layers[i].colors[1], info.layers[i].colors[2]);
                        layer.setWidth(info.layers[i].width);

                        for (let j = 0; j < info.layers[i].layerSections.length; j = j + 4) {
                            layer.addLayerSection(info.layers[i].layerSections[j], info.layers[i].layerSections[j + 1], info.layers[i].layerSections[j + 2], info.layers[i].layerSections[j + 3]);
                        }

                        layer.setId(info.layers[i].id);
                        layer.setUsername(info.layers[i].username);
                        layer.setProtected(this.layers[index].getProtected(),socket.id);
                        info.layers[i].protected = this.layers[index].getProtected();
                        this.layers.splice(index + 1, 0, layer);
                    }
                    this.layers.splice(index, 1);
                    this.emitInfo("replaceLayer", info, socket);
                    DbCommunication.getInstance().updateLayerImage(this, (image: mongoose.Document) => { })
                }
            }
        })
    }
 /**
     * Format layer from image
     *
     * @class ImageLayer
     * @method formatLayer
     * @param layer
     * @returns object
     */
    public formatLayer(layer: Layer): any {
        let color = [];

        color.push(layer.getColor().getRed());
        color.push(layer.getColor().getGreen());
        color.push(layer.getColor().getBlue());

        let width = layer.getWidth();

        let layerSections = [];

        for (let layerSection of layer.getLayerSections()) {
            let x1 = layerSection.getFirstPoint().getX();
            let y1 = layerSection.getFirstPoint().getY();

            let x2 = layerSection.getSecondPoint().getX();
            let y2 = layerSection.getSecondPoint().getY();

            layerSections.push(x1);
            layerSections.push(y1);
            layerSections.push(x2);
            layerSections.push(y2);
        }

        let username = layer.getUsername();
        let id = layer.getId();
        let protection = layer.getProtected();

        let object = {
            "colors": color,
            "width": width,
            "layerSections": layerSections,
            "id": id,
            "username": username,
            "protected": protection
        }

        //console.log(object);
        return object;
    }
 /**
     * Remove all layers from image
     *
     * @class ImageLayer
     * @method clear image
     * @param socket client socket
     */
    public clearImage(socket: any): void {
        this.layers = [];

        this.emitInfo("clear", "", socket);
        DbCommunication.getInstance().updateLayerImage(this, (image: mongoose.Document) => { })
    }

     /**
     * Get all layers
     *
     * @class ImageLayer
     * @method getLayers
     * @returns layers
     */
    public getLayers(): Layer[] {
        return this.layers;
    }

   /**
     * Retrieve the index of a layer in the array
     *
     * @class ImageLayer
     * @method findLayerIndex
     * @param layerInfo
     * @returns index
     */
    public findLayerIndex(layerInfo: any): number {
        for (let layer of this.layers) {
            if (layer.getUsername() == layerInfo.username && layer.getId() == layerInfo.id) {
                return this.layers.indexOf(layer);
            }
        }

        return undefined;
    }

       /**
     * Release a layer from protection
     *
     * @class ImageLayer
     * @method releaseLayer
     * @param socket Cliet socket
     */
    public releaseLayer(socket: any): void {

        let layerInfo: any[] = []
        for (let layer of this.layers) {
            if (layer.getOwner() != null) {
                if (layer.getOwner() === socket.id) {
                    layer.setProtected(false, socket);
                    let layerObject = {
                        "username": layer.getUsername(),
                        "id": layer.getId()

                    }

                    layerInfo.push(layerObject);
                }
            }
        }
        this.emitInfo("lassoSelect", layerInfo, socket);
    }

       /**
     * Protect a layer
     *
     * @class ImageLayer
     * @method protectLayer
     * @param socket Cliet socket
     * @param layerInfo 
     */
    public protectLayer(layerInfo: any, socket: any) {

        for (let layer of layerInfo) {
            if (this.findLayerIndex(layer) != undefined) {
                this.layers[this.findLayerIndex(layer)].setProtected(!this.layers[this.findLayerIndex(layer)].getProtected(), socket.id);
            }
            else
                console.log("Protect error")
        }

        this.emitInfo("lassoSelect", layerInfo, socket);
    }


}