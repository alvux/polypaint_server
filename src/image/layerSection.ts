/**
 *  @file   layerSections.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Layer Section object
 *
 */
import { Point } from './point'

export class LayerSection {

   private firstPoint: Point = new Point();
   private secondPoint : Point = new Point();
     /**
    * Constructor
    *
    * @class LayerSection
    * @method constructor
    */
   constructor(x1 :number , y1 : number, x2: number, y2 : number) {
       this.firstPoint.setX(x1);
       this.firstPoint.setY(y1);

       this.secondPoint.setX(x2);
       this.secondPoint.setY(y2);
   }

      /**
     * Get First point
     *
     * @class LayerSection
     * @method getFirstPoint
     */
   public getFirstPoint (): Point {
       return this.firstPoint;
   }
    /**
    * Get second point
    *
    * @class layerSection
    * @method getSecondPOint
    */
   public getSecondPoint (): Point {
        return this.secondPoint;
}

}