/**
 *  @file   point.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Point object
 *
 */
export class Point {

    private x : number;
    private y: number;

     /**
    * Point constructor
    *
    * @class Point
    * @method constructor
    */
    constructor(){
       this.x = 0;
       this.y = 0;
    }

    /**
     * get X
     *
     * @class Point
     * @method getX
     * @returns x
     */
    public getX() : number {
        return this.x;
    }
   /**
     * Set X
     *
     * @class Point
     * @method setX
     * @param x
     */
    public setX(x: number) : void {
        this.x = x;
    }

    /**
     * get Y
     *
     * @class Point
     * @method getY
     * @returns y
     */
    public getY() : number {
        return this.y;
    }
   /**
     * Set Protected
     *
     * @class Point
     * @method setY
     * @param y
     */
    public setY(y: number) : void {
        this.y = y;
    }
}