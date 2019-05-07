/**
 *  @file   socketManager.ts
 *  @author  Alexandre Vu , Eric Marchi
 *  @date    1/12/2018
 *
 *  @section DESCRIPTION
 *
 *  Managing the users, their socket, and all messages sent by them
 *
 */

import { createServer, Server } from "http";
import { ChatManager } from './chat/chatManager'
import { ImageManager } from './image/imageManager'
import { ImageManagerUtils } from './image/imageManagerUtils'
import * as io from "socket.io";
import { LoginManager } from "./login/loginManager";

export class SocketManager {

    private static instance: SocketManager;
    private socketServer: SocketIO.Server;
    private users: Map<number, string> = new Map();
    private chatManager = new ChatManager();
 

    /**
     * Constructor
     *
     * @class socketManager
     * @method constructor
     */
    constructor(server: Server) {
        this.createSocket(server);
        this.connectSocket();
    }

    /**
     * Static method in order to be use as a singleton (pattern) for implementing a unique SocketManager.
     *
     * @class socketManager
     * @method getInstance
     * @return {SocketManager.instance} Returns the socket manager instance.
     */
    static getInstance(server: Server): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager(server);
        }

        return SocketManager.instance;
    }

    /**
     * Create a socket
     *
     * @class socketManager
     * @method createSocket
     * @param server Instance from ConfigServer class
     */
    public createSocket(server: Server): void {
        this.socketServer = io(server);
    }

    /**
     * Used to manage chat messages and online users.
     *
     * @class socketManager
     * @method connectSocket
     */
    public connectSocket(): void {
        this.socketServer.on('connect', (socket: any) => {
            this.chatManager.init(this.socketServer, socket);
            ImageManager.getInstance().init(this.socketServer, socket);
            LoginManager.getInstance().init(socket);
            this.disconnect(socket);
        });

    }


    /**
     * Disconnect a user
     *
     * @class socketManager
     * @method disconnect
     * @param socket socket used to connect users.
     */
    public disconnect(socket: any): void {

        socket.on('disconnect', () => {
            let image = ImageManagerUtils.getImageWithSocket(ImageManager.getInstance().getImages(),socket); 
            if(image != undefined)
                ImageManager.getInstance().leaveImage(socket);
              
                LoginManager.getInstance().removeUser(socket);
        });

       
    }
}