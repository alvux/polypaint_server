/**
 *  @file   images.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 *Image Schema
 *
 */
import * as mongoose from 'mongoose';
import { Layer } from '../image/layer';
import { LayerSection } from '../image/layerSection';

let schema =  mongoose.Schema;
let imagesSchema = new schema({

    users: [{ username: String }],
    layers: [schema.Types.Mixed],
    visibility: String,
    name: String,
    author: String,
    date: String,
    dateModified: String,
    protection: String,
    password: String,
    editingStyle: String,
    mode: String,
    status: String,
    thumbnail: schema.Types.Mixed,
    ratings: [schema.Types.Mixed],
    pixels: schema.Types.Mixed

});

export default mongoose.model('images', imagesSchema);