/**
 *  @file   configServer.ts
 *  @author  Alexandre Vu , Eric Marchi
 *  @date    1/12/2018
 *
 *  @section DESCRIPTION
 *
 *  Configuration of the express server
 *
 */

import * as express from "express";
import { createServer, Server } from "http";
import * as bodyparser from "body-parser";
import * as cors from "cors";
import { Connection } from "./routes/connection";
import { ImageRoute } from "./routes/imageRoute";
import { GalleryRoute } from "./routes/gallery";

export class ConfigServer {

    private application: express.Application;
    private server: Server;

    /**
    * Constructor.
    *
    * @class ConfigServer
    * @constructor
    */

    constructor(ipAddress: string) {
        this.createApp();
        this.config(ipAddress);
        this.createServer();
        this.listen();
        this.routing();
    }


    /**
    *initialization of the express server
    *
    * @class ConfigServer
    * @method createApp
    */
    private createApp(): void {
        this.application = express();
    }

    /**
    *initialization of the http server
    *
    * @class ConfigServer
    * @method createServer
    */
    private createServer(): void {
        this.server = createServer(this.application);
    }

    /**
    *Configuration of the ip address and the port of the server
    *
    * @class ConfigServer
    * @method config
    * @param ipAddress The server ip adress
    */
    private config(ipAddress: string): void {
        this.application.set("port", 5000);
        this.application.set("ipaddress", ipAddress);
    }

    /**
    *Server listening for incoming request
    *
    * @class ConfigServer
    * @method listen
    */
    private listen(): void {
        this.server.listen(this.application.get("port"), this.application.get("ipaddress"), () => {
            console.log("Server is running");
        });
    }


    /**
    *Routes
    *
    * @class ConfigServer
    * @method routing
    */
    private routing(): void {

        this.application.use(bodyparser.json({limit:'50mb'}));
        this.application.use(bodyparser.urlencoded({limit:'50mb',
            extended: true
        }));
        this.application.use(cors());

        this.application.get("/", function (req, res) {
            res.send("Hello");
        });

        this.application.use('/connection', Connection.getInstance().getRouter());
        this.application.use('/image', ImageRoute.getInstance().getRouter());
        this.application.use('/gallery', GalleryRoute.getInstance().getRouter());
    }


    /**
    *Get the express application
    *
    * @class ConfigServer
    * @method getApp
    * @returns {returns the express application}
    */
    public getApp(): express.Application {
        return this.application;
    }


    /**
    *Get the http server
    *
    * @class ConfigServer
    * @method getServer
    * @returns {returns the server}
    */
    public getServer(): Server {
        return this.server;
    }
}
