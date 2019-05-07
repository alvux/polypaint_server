/**
 *  @file   chatManager.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 *  Managing the chat rooms
 *
 */

import * as io from "socket.io";

export class ChatManager {

    private channels: Map<string, string> = new Map();
    private channelsList: Array<String> = new Array();
    private users: Map<string, string> = new Map();
    private socketServer: SocketIO.Server;

       /**
     * Constructor
     *
     * @class ChatManager
     * @method constructor
     */
    constructor() {
        this.channelsList.push("General");
        this.channels.set("General", "");
    }


    /**
     * Initialize class method
     *
     * @class ChatManager
     * @method init
     * @param socketServer Server socket
     *  @param socket Client socket
     */
    public init(socketServer: SocketIO.Server, socket: any) {

        this.socketServer = socketServer;
        this.createChannel(socket);
        this.joinChannel(socket);
        this.sendMessage(socket);
        this.leaveChannel(socket);
        this.deleteChannel(socket);
        this.sendChannelList(socket);
    }

       /**
     * Send a channel list the client
     *
     * @class ChatManager
     * @method sendChannelList
     *  @param socket Client socket
     */
    public sendChannelList(socket: any): void {
        socket.on('fetchChannelsList', (info: any) => {

            console.log("[INFO] fetchChannelList Event :", info);

            console.log("[INFO] Channels list ->", this.channelsList);

            socket.emit("channelsList", this.channelsList);
        });
    }

      /**
     * Create a channel
     *
     * @class ChatManager
     * @method createChannel
     * @param socket Client socket
     */
    public createChannel(socket: any): void {

        socket.on('createChannel', (info: any) => {

            let infoObject = JSON.parse(info);
            console.log("[INFO] createChannel Event :", infoObject.username, "->", infoObject.channelName);

            let username: string = infoObject.username;
            let channelName: string = infoObject.channelName;

            if (!this.channels.has(infoObject.channelName)) {
                console.log("[UPDATE] Creating new channel ->", channelName)
                this.channels.set(channelName, username);
                this.channelsList.push(channelName);
                this.socketServer.emit("newChannel", channelName);
                console.log("[UPDATE] Channels map ->", this.channels)
            }

        });

    }
   /**
     * Join a channel
     *
     * @class ChatManager
     * @method joinChannel
     * @param socket Client socket
     */
    public joinChannel(socket: any): void {

        socket.on('joinChannel', (info: any) => {

            let infoObject = JSON.parse(info);
            console.log("[INFO] joinChannel Event :", infoObject.username, "->", infoObject.channelName);

            let username: string = infoObject.username;
            let channelExist = this.channels.has(infoObject.channelName);

            if (channelExist) {
                if (!this.users.has(socket.id)) {
                    this.users.set(socket.id, username);
                }

                var myObject = {
                    message: username + " has joined the channel",
                    channelName: infoObject.channelName
                }
                socket.join(infoObject.channelName);
                socket.emit('joinChannel', infoObject.channelName);
                socket.broadcast.to(infoObject.channelName).emit('message', myObject);
            }
        });
    }
   /**
     * Send a message to all sockets
     *
     * @class ChatManager
     * @method sendMessage
     * @param socket Client socket
     */
    public sendMessage(socket: any): void {

        socket.on('message', (info: any) => {
            let infoObject = JSON.parse(info);
            var myObject = {
                message: "[ " + infoObject.username + " " + new Date().toLocaleTimeString() + " ] - " + infoObject.message,
                channelName: infoObject.channelName
            }

            this.socketServer.emit('message', myObject);
        });
    }

      /**
     * Leave channel
     *
     * @class ChatManager
     * @method leaveChannel
     * @param socket Client socket
     */
    public leaveChannel(socket: any): void {

        socket.on('leaveChannel', (info: any) => {
            let infoObject = JSON.parse(info);
            console.log("[INFO] leaveChannel Event :", infoObject.username, "->", infoObject.channelName);

            socket.leave(infoObject.channelName);

            var myObject = {
                message: infoObject.username + " has left the channel",
                channelName: infoObject.channelName
            }
            socket.broadcast.to(infoObject.channelName).emit('message', myObject);
            socket.emit("leaveChannel", infoObject.channelName);
        });
    }

    
      /**
     * Delete a  channel
     *
     * @class ChatManager
     * @method leaveChannel
     * @param socket Client socket
     */
    public deleteChannel(socket: any) {

        socket.on('deleteChannel', (info: any) => {
            let infoObject = JSON.parse(info);
            console.log("[INFO] deleteChannel Event :", infoObject.username, "->", infoObject.channelName);

            let self = this;
            this.socketServer.in(infoObject.channelName).clients((err:any,clients:any)=>{
                console.log(clients);
                for (let socketId of clients) {
                    console.log(socketId);
                    let userSocket = self.socketServer.sockets.connected[socketId];
                    userSocket.leave(infoObject.channelName);
                }

                self.channelsList.splice(self.channelsList.indexOf(infoObject.channelName), 1);
                self.channels.delete(infoObject.channelName);
    
                self.socketServer.emit('deleteChannel', infoObject.channelName);
            })  

        });
    }
}