/**
 *  @file   login.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * login Schema
 *
 */
import * as mongoose from 'mongoose'
//import * as mongooseFieldEncryption from 'mongoose-field-encryption'
import * as bcrypt from 'bcrypt'

const SALT_WORK_FACTOR = 10;

let Schema = mongoose.Schema

let loginSchema = new Schema({
    username: String,
    password: String
});

loginSchema.pre('save', function (next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {

        if (err)
            return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {

            if (err)
                return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});


export default mongoose.model('login', loginSchema);
//module.exports = mongoose.model('login', loginSchema);