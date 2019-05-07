/**
 *  @file   color.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Color object
 *
 */

 
export class Color {

    private red : number;
    private blue : number;
    private green: number;

     /**
     * Constructor
     *
     * @class ChatManager
     * @method constructor
     */
    constructor(red: number, green: number, blue:number){
        this.red = red;
        this.blue = blue;
        this. green = green;
    }
/**
     * Get the red color
     *
     * @class Color
     * @method getRed
     */
    public getRed() : number {
        return this.red;
    }

     /**
     * Set red color
     *
     * @class Color
     * @method setRed
     * @param red Red Color
     */
    public setRed(red: number) : void {
        this.red = red;
    }

    /**
     * Get the blue color
     *
     * @class Color
     * @method getBlue
     */
    public getBlue() : number {
        return this.blue;
    }
   /**
     * Set blue color
     *
     * @class Color
     * @method setBlue
     * @param blue Blue Color
     */
    public setBlue(blue: number) : void {
        this.blue = blue;
    }
   /**
     * Get the green color
     *
     * @class Color
     * @method getGreen
     */
    public getGreen() : number {
        return this.green;
    }

       /**
     * Set green color
     *
     * @class Color
     * @method setGreen
     * @param green Green Color
     */
    public setGreen(green: number) : void {
        this.green = green;
    }
}