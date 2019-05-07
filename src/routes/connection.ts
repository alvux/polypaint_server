/**
 *  @file   connection.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * HTTP request for login
 *
 */
import * as express from "express";
import { DbCommunication } from "../dbCommunication";
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import { LoginManager } from "../login/loginManager";


export class Connection {

    private router: express.Router;
    private static instance: Connection;
 
    /**
     * Constructor
     *
     * @class Connection
     * @method constructor
     */
    constructor() {
        this.router = express.Router();
        this.routes();
    }
     /**
     * Static method in order to be use as a singleton (pattern) for implementing a unique Connection.
     *
     * @class Connection
     * @method getInstance
     * @return {SocketManager.instance} Returns the socket manager instance.
     */
    static getInstance(): Connection {

        if (!Connection.instance) {
            this.instance = new Connection();
        }
        return this.instance;
    }
       /**
     * Http request
     *
     * @class routes
     * @method routes
     */
    private routes() {
        this.router.post('/login', (req, res) => {
            let database = DbCommunication.getInstance();
            let username: string;
            let password: string;

            username = req.body.username;
            password = req.body.password;

            database.findUser(username, (user: mongoose.Document) => {

                if (user != null && !LoginManager.getInstance().findUserByUsername(username)) {
                    this.checkPassword(password, user.get("password"), (isMatch: boolean) => {
                        res.send(isMatch);
                    })
                }
                else {
                    res.send(false);
                }

            })

        });

        this.router.post('/register', (req, res) => {
            let database = DbCommunication.getInstance();
            let username: string;
            let password: string;

            username = req.body.username;
            password = req.body.password;

            database.findUser(username, (user: mongoose.Document) => {

                if (user === null) {
                    res.send(true);
                    database.saveUser(username, password);
                }
                else {
                    res.send(false);

                }

            })
        });

        this.router.post('/changePassword', (req,res) => {

            let database = DbCommunication.getInstance();
            let username: string;
            let oldPassword: string;
            let newPassword: string;

            username = req.body.username;
            oldPassword = req.body.oldPassword;
            newPassword = req.body.newPassword;

            database.findUser(username, (user: mongoose.Document) => {

                if (user != null) {
                    this.checkPassword(oldPassword, user.get("password"), (isMatch: boolean) => {
                       if(isMatch){
                        user.set('password', newPassword);
                            user.save((err:any, product: mongoose.Document)=>{
                                res.send(true);
                            });
                       }

                       else{
                           res.send(false);
                       }
                    })
                }
                else {
                    res.send(false);
                }

            })
            

        });

    }
   /**
     * Verify encrypt password
     *
     * @class Connection
     * @method checkPassword
     * @param password
     * @param hashPassword
     * @param callback function
     */
    private checkPassword(password: string, hashPassword: string, callback: any) {
        bcrypt.compare(password, hashPassword, (err, isMatch) => {
            if (err) return callback(err);
            callback(isMatch);
        });
    }
 /**
     * get express router
     *
     * @class Connection
     * @method getRouter
     */
    public getRouter(): express.Router {
        return this.router;
    }
}
