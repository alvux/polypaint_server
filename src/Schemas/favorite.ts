/**
 *  @file   favorites.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Favorite Schema
 *
 */
import * as mongoose from 'mongoose';
import { FavoriteManager } from '../image/favoritesManager';


let schema =  mongoose.Schema;
let favoritesSchema = new schema({

    username:String,
    title: String,
    author: String

});

export default mongoose.model('favorites', favoritesSchema);