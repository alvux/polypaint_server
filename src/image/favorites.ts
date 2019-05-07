/**
 *  @file   favorite.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Favorite object
 *
 */

export class Favorite {

    private username : string;
    private title : string;
    private author: string;

     /**
     * Constructor
     *
     * @class Favorite
     * @method constructor
     */
    constructor(username: string, title: string, author:string){
        this.username = username;
        this.title = title;
        this.author = author;
    }

    /**
     * Get username
     *
     * @class Favorite
     * @method getUsername
     */
    public getUsername() : string {
        return this.username;
    }

    /**
     * Set username
     *
     * @class Favorite
     * @method setUsername
     * @param username Client username
     */
    public setUsername(username: string) : void {
        this.username = username;
    }

    /**
     * Get title
     *
     * @class Favorite
     * @method getTitle
     */
    public getTitle() : string {
        return this.title;
    }

    /**
     * Set title
     *
     * @class Favorite
     * @method setTitle
     * @param title Image title
     */
    public setTitle(title: string) : void {
        this.title = title;
    }
/**
     * Get author
     *
     * @class Favorite
     * @method getAuthor
     */
    public getAuthor() : string {
        return this.author;
    }

     /**
     * Set Author
     *
     * @class Favorite
     * @method setAuthor
     * @param author Image author
     */
    public setAuthor(author: string) : void {
        this.author = author;
    }
}