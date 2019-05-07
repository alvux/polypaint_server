/**
 *  @file   user.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * User object
 *
 */
export class User{

    private username : string;
    private socket: any
    
    constructor(username: string, socket: any){
        this.username = username;
        this.socket = socket;
    }
/**
     * Set socket
     *
     * @class User
     * @method setSocket
     * @param socket
     */
    public getUsername(): string{

        return this.username;
    }
/**
     * Set username
     *
     * @class User
     * @method setUsername
     * @param username
     */
    public setUsername(username:string): void{
        this.username = username;
    }
/**
     * Set socket
     *
     * @class User
     * @method getSocket
     */
    public getSocket(): any{

        return this.socket;
    }
/**
     * Set socket
     *
     * @class User
     * @method setSocket
     * @param socket
     */
    public setSocket(socket:any): void{
        this.socket = socket;
    }
}