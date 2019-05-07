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

import { ConfigServer } from "./configServer";
import { SocketManager } from "./socketManager";
import { ReadLine, createInterface } from "readline";
import { DbCommunication } from "./dbCommunication";

    let server = new ConfigServer('0.0.0.0').getServer();

    let socketManagerInstance = SocketManager.getInstance(server);

    let dbInstance = DbCommunication.getInstance();
    
    dbInstance.downloadImages();
    dbInstance.downloadFavorite();





