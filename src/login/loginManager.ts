/**
 *  @file   loginManager.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Manages user connections
 *
 */
import { User } from "./user";

export class LoginManager{

    static instance: LoginManager;
    private users: User[] = [];

      /**
     * Static method in order to be use as a singleton (pattern) for implementing a unique SocketManager.
     *
     * @class LoginManager
     * @method getInstance
     * @return {SocketManager.instance} Returns the socket manager instance.
     */
    static getInstance(): LoginManager {
        if (!LoginManager.instance) {
            LoginManager.instance = new LoginManager();
        }

        return LoginManager.instance;
    }


      /**
     * Intialize socket
     *
     * @class LoginManager
     * @method init
     * @param socket
     */
    public init(socket: any){
        this.addUser(socket);
    }

      /**
     * addUser socket
     *
     * @class LoginManager
     * @method addUser
     * @param socket
     */
    public addUser(socket:any){

        socket.on('addUser', (info:any)=>{

            console.log("INFO ADD USER ")
            //let username = JSON.parse(info);
            let newUser = new User(info,socket);
            console.log(newUser);
            this.users.push(newUser);

        })
     
    }

       /**
     * Get usernames by using sockets
     *
     * @class LoginManager
     * @method getUsernamesFromSocket
     * @param sockets
     */
    public getUsernamesFromSocket (sockets: any[]) : string[] {
       
        let usernames : string[] = []

        for (let socket of sockets ){
            let index = this.findUserBySocketIndex(socket);

           
            if(index != -1){
                usernames.push(this.users[index].getUsername());
            }
        }

        return usernames;
    }

         /**
     * Find the index of a user in the array
     *
     * @class LoginManager
     * @method findUserBySocketIndex
     * @param socket
     */
    public findUserBySocketIndex(socket: any): number{
        for(let i = 0; i < this.users.length; i++){

            if(this.users[i].getSocket().id === socket.id){
                return i;
            }
        }
        return -1;
    }

          /**
     * Find a User with the username
     *
     * @class LoginManager
     * @method findUserByUsername
     * @param username
     */
    public findUserByUsername(username: string): boolean{
        for(let i = 0; i < this.users.length; i++){
            if(this.users[i].getUsername() === username){
                console.log("found")
                return true;
            }
        }
        return false;
    }

     /**
     * Find a User socket with the username
     *
     * @class LoginManager
     * @method findSocketByUsername
     * @param username
     */
    public findSocketByUsername(username:string): any {
        for(let i = 0; i < this.users.length; i++){
            if(this.users[i].getUsername() === username){
               
                return this.users[i].getSocket();
            }
        }
        return undefined;
    }

    
     /**
     * Remove a user
     *
     * @class LoginManager
     * @method removeUser
     * @param socket
     */
    public removeUser(socket:any){
       let index = this.findUserBySocketIndex(socket);

       if(index != -1){
           this.users.splice(index,1);
       }
       else{
           console.log("Remove User error");
       }
    }

}