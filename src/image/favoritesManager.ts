/**
 *  @file   favoritesManager.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Static class that manages favorite
 *
 */
import { Favorite } from "./favorites";
import { DbCommunication } from "../dbCommunication";
export class FavoriteManager {

    private favorites: Favorite[] = [];
    private static instance: FavoriteManager;
    
     /**
     * Constructor
     *
     * @class FavoriteManager
     * @method constructor
     */
    constructor() {

    }

    /**
     * Static method in order to be use as a singleton (pattern) for implementing a unique FavoriteManager.
     *
     * @class Favorite Manager
     * @method getInstance
     * @return {SocketManager.instance} Returns the socket manager instance.
     */
    static getInstance(): FavoriteManager {
        if (!FavoriteManager.instance) {
            FavoriteManager.instance = new FavoriteManager();

        }

        return FavoriteManager.instance;
    }

       /**
     * Method that saves favorite in memory and save into database
     *
     * @class Favorite Manager
     * @method addFavorite
     * @param favorite 
     */
    public addFavorite(favorite: Favorite): void {
        this.favorites.push(favorite);
        DbCommunication.getInstance().saveFavorite(favorite);
    }

    
       /**
     * Method that loads favorite from database
     *
     * @class Favorite Manager
     * @method loadFavorite
     * @param favorite 
     */
    public loadFavorite(favorite: Favorite): void {
        this.favorites.push(favorite);
    }

        /**
     * Find the index of a favorite in the favorites array
     *
     * @class Favorite Manager
     * @method findIndexFavorite
     * @param favorite 
     */
    public findIndexFavorite(favorite: Favorite): number{
        for(let i = 0 ; i<this.favorites.length; i++){
           if (this.favorites[i].getUsername() == favorite.getUsername() && this.favorites[i].getAuthor() == favorite.getAuthor() 
           && this.favorites[i].getTitle() == favorite.getTitle()){
               return i;
           }
        
        }

        return -1;
    }

      /**
     * Remove favorite from array
     *
     * @class Favorite Manager
     * @method removeFavorite
     * @param favorite 
     */
    public removeFavorite(favorite: Favorite): void {

        let index = this.findIndexFavorite(favorite);
        if (index > - 1) {
            this.favorites.splice(index, 1);
            DbCommunication.getInstance().removeFavorite(favorite);
        }
        else{
            console.log("Remove error");
        }
    }

        /**
     * Search for favorite according to the username
     *
     * @class Favorite Manager
     * @method getFavoritesWithUsername
     * @param username
     * @return favoritesUsername
     */
    public getFavoritesWithUsername(username: string): any {
        let favoritesUsername: any[] = [];

        for (let favorite of this.favorites) {

            if (favorite.getUsername() === username) {
                let object = {
                    "username": favorite.getUsername(),
                    "title": favorite.getTitle(),
                    "author": favorite.getAuthor()
                }
                favoritesUsername.push(object);
            }
        }
        return favoritesUsername;
    }


}
