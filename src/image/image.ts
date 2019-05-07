/**
 *  @file   image.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Image object
 *
 */
import * as io from "socket.io";
import { Layer } from './layer';
import { LayerSection } from './layerSection'
import { DbCommunication } from "../dbCommunication";
import * as mongoose from 'mongoose';
import { callbackify } from "util";
import { Rating } from "./rating";


export class Image {

    protected users: any[] = []
    protected visibility: string;
    protected name: string;
    protected author: string;
    protected date: string;
    protected dateModified: string;
    protected protection: string;
    protected password: string;
    protected editingStyle: string;
    protected mode: string;
    protected status: string;
    protected thumbnnail: any = undefined;
    protected ratings: Rating[] = [];

     /**
     * Constructor
     *
     * @class Image
     * @method constructor
     */
    constructor(visibility: string, name: string, author: string, date: string, dateModified: string, protection: string, password: string, editingStyle: string, mode: string, status: string) {
        this.visibility = visibility;
        this.name = name;
        this.author = author;
        this.date = date;
        this.protection = protection;

        if (password === undefined) {
            this.password = "default";
        }
        else
            this.password = password;

        this.editingStyle = editingStyle;
        this.mode = mode;
        this.dateModified = dateModified;
        this.status = status;
        this.thumbnnail = null;
    }

    /**
     * Get ratings
     *
     * @class Image
     * @method getRatings
     * @returns ratings
     */
    public getRatings(): Rating[] {
        return this.ratings;
    }

    /**
     * Set rating
     *
     * @class Image
     * @method setRating
     * @param rating[]
     */
    public setRatings(ratings: Rating[]): void {
        this.ratings = ratings;
    }
      /**
     * Add a user to the user array
     *
     * @class Image
     * @method addUser
     * @param socket client socket
     */
    public addUser(socket: any) {
        this.users.push(socket);
    }
  /**
     * Set thumbnail
     *
     * @class Image
     * @method setRating
     * @param rating[]
     */
    public setThumbnail(thumbnail: any): void {
        this.thumbnnail = thumbnail;
    }
      /**
     * Get thumbnail
     *
     * @class Image
     * @method getThumbnail
     * @returns thumbnail
     */
    public getThumbnail(): any {
        return this.thumbnnail;
    }

      /**
     * Get status
     *
     * @class Image
     * @method getStatus
     * * @returns status
     */
    public getStatus(): string {
        return this.status;
    }

      /**
     * Set status
     *
     * @class Image
     * @method setStatus
     * @param status
     */
    public setStatus(status: string): void {
        this.status = status;
    }

      /**
     * Get modified date
     *
     * @class Image
     * @method getDateModified
     * @returns dateModified
     */
    public getDateModified(): string {
        return this.dateModified;
    }
  /**
     * Set date modified
     *
     * @class Image
     * @method setDateModified
     * @param dateModified
     */
    public setDateModified(dateModified: string): void {
        this.dateModified = dateModified;
    }

       /**
     * Get drawing mode
     *
     * @class Image
     * @method getMode
     * @returns mode
     */
    public getMode(): string {
        return this.mode;
    }

     /**
     * Set mode
     *
     * @class Image
     * @method setMode
     * @param mode
     */
    public setMode(mode: string): void {
        this.mode = mode;
    }

       /**
     * Get editing style
     *
     * @class Image
     * @method getEditingStyle
     * @returns editingStyle
     */
    public getEditingStyle(): string {
        return this.editingStyle;
    }
   /**
     * Set editingStyle
     *
     * @class Image
     * @method setEditingStyle
     * @param editingStle
     */
    public setEditingStyle(editingStyle: string): void {
        this.editingStyle = editingStyle;
    }
  /**
     * Get password
     *
     * @class Image
     * @method getPassword
     * @returns password
     */
    public getPassword(): string {
        return this.password;
    }

     /**
     * Set password
     *
     * @class Image
     * @method setPassword
     * @param password
     */
    public setPassword(password: string): void {
        this.password = password;
    }
  /**
     * Get protection
     *
     * @class Image
     * @method getProtection
     * @returns protection
     */
    public getProtection(): string {
        return this.protection;
    }
 /**
     * Set protection
     *
     * @class Image
     * @method setProtection
     * @param protection
     */
    public setProtection(protection: string): void {
        this.protection = protection;
    }

     /**
     * Get creation date
     *
     * @class Image
     * @method getDate
     * @returns date
     */
    public getDate(): string {
        return this.date;
    }
 /**
     * Set creation date
     *
     * @class Image
     * @method setCreationDate
     * @param date
     */
    public setDate(date: string): void {
        this.date = date;
    }
     /**
     * Get image author
     *
     * @class Image
     * @method getDate
     * @returns date
     */
    public getAuthor(): string {
        return this.author;
    }
 /**
     * Set Author
     *
     * @class Image
     * @method setAuthor
     * @param author
     */
    public setAuthor(author: string): void {
        this.author = author;
    }
 /**
     * Get image name
     *
     * @class Image
     * @method getName
     * @returns name
     */
    public getName(): string {
        return this.name;
    }
 /**
     * Set name
     *
     * @class Image
     * @method setName
     * @param name
     */
    public setName(name: string): void {
        this.name = name;
    }
 /**
     * Get image visibility
     *
     * @class Image
     * @method getVisibility
     * @returns visibility
     */
    public getVisibility(): string {
        return this.visibility;
    }

     /**
     * Set visibility
     *
     * @class name
     * @method setVisibility
     * @param visibility
     */
    public setVisibility(visibility: string): void {
        this.visibility = visibility;
    }

   /**
     * Emit info
     *
     * @class Image
     * @method emitInfo
     * @param eventName socket event name
     * @param info info to send to all users except the sender
     * @param userSocket ClientSocket
     */
    public emitInfo(eventName: string, info: any, userSocket: any): void {

        if (userSocket == null) {
            return;
        }

        for (let socket of this.users) {
            if (socket.id != userSocket.id) {
                socket.emit(eventName, info);
            }
        }
    }


 /**
     * Get Users
     *
     * @class Image
     * @method getUsers
     * @returns users
     */
    public getUsers(): any {
        return this.users;
    }

     /**
     * Remove a user from the array
     *
     * @class Image
     * @method removeUser
     * @param userSocket
     */
    public removeUser(userSocket: any): void {

        for (let i = 0; i < this.users.length; i++) {

            if (this.users[i] === userSocket) {
                this.users.splice(i, 1);
                if (this.users.length === 0) {
                    this.status = "Open for Edition";
                }
                return;
            }
        }




    }
    /**
     * Find the rating object of an image
     *
     * @class Image
     * @method findRating
     * @param infoRating
     * @return rating
     */
    public findRating(infoRating: any): Rating {

        if (this.ratings.length === 0) {
            return undefined
        }
        else {
            for (let rating of this.ratings) {

                if (rating.username === infoRating.username) {
                    return rating;
                }
            }

            return undefined;
        }
    }
  /**
     * Calculate the average rating
     *
     * @class Image
     * @method findRating
     * @return average rating
     */
    public averageRating(): number {
        let sum: number = 0;

        if (this.ratings.length == undefined || this.ratings.length === 0) {

            return 0;
        }
        else {

            for (let rating of this.ratings) {
                sum += rating.value;
            }

            return sum / this.ratings.length;
        }




    }

      /**
     * Update the rating of an image
     *
     * @class Image
     * @method updateRating
     * @param infoRating
     * @return average rating
     */
    public updateRating(infoRating: any): number {

        let rating = this.findRating(infoRating);

        if (rating != undefined) {
            this.ratings.splice(this.ratings.indexOf(rating), 1)
        }

        let newRating: Rating = new Rating();
        console.log(infoRating);
        newRating.username = infoRating.username;
        newRating.value = infoRating.rating;
        this.ratings.push(newRating);

        DbCommunication.getInstance().updateRatings(this);

        return this.averageRating();
    }

}


