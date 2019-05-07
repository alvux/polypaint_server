/**
 *  @file   layer.ts
 *  @author  Alexandre Vu
 *  @date    4/15/2018
 *
 *  @section DESCRIPTION
 *
 * Layer object
 *
 */
import { Color } from './color'
import { LayerSection } from './layerSection'


export class Layer {

    private color: Color;
    private lineWidth: number;
    private layerSections: LayerSection[] = [];
    private username: string;
    private id: number;
    private protected: boolean = false;
    private owner: string;

     /**
    * Constructor
    *
    * @class ImagePixel
    * @method constructor
    */
    constructor() {
        this.protected = false;
        this.owner = "";
    }

      /**
     * Get username
     *
     * @class Layer
     * @method getProtected
     */
    public getProtected(): boolean {
        return this.protected;
    }

       /**
     * Set Protected
     *
     * @class Layer
     * @method setProtected
     * @param protect
     * @param id
     */
    public setProtected(protect: boolean, id:string){
        this.protected = protect;

        if(this.protected){
            this.owner = id;
        }
        else{
            this.owner = "";
        }
    }

      /**
     * Get owner
     *
     * @class Layer
     * @method getOwner
     */
    public getOwner() : any{
        return this.owner;
    }
      /**
     * Get color
     *
     * @class Layer
     * @method getColor
     */
    public getColor(): Color {
        return this.color;
    };
   /**
     * Set Color
     *
     * @class Layer
     * @method setColor
     * @param red
     * @param green
     * @param blue
     */
    public setColor(red: number, green: number, blue: number): void {
        this.color = new Color(red, green, blue);
    }
  /**
     * Get width
     *
     * @class Width
     * @method getWidth
     */
    public getWidth(): number {
        return this.lineWidth;
    };
 /**
     * Set Width
     *
     * @class Layer
     * @method setWidth
     * @param lineWidth
     */
    public setWidth(lineWidth: number): void {
        this.lineWidth = lineWidth;
    };
 /**
     * Add layer section in memory
     *
     * @class Layer
     * @method setColor
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     */
    public addLayerSection(x1: number, y1: number, x2: number, y2: number): void {
        let layerSection = new LayerSection(x1, y1, x2, y2);
        this.layerSections.push(layerSection);
    };
  /**
     * Get layerSection
     *
     * @class Layer
     * @method getLayerSections
     */
    public getLayerSections(): LayerSection[] {
        return this.layerSections;
    }
  /**
     * Get Id
     *
     * @class Layer
     * @method getId
     */
    public getId(): number {
        return this.id;
    }
 /**
     * Set Id
     *
     * @class Layer
     * @method setId
     * @param id
     */
    public setId(id: number) : void {
        this.id = id;
    }
  /**
     * Get username
     *
     * @class Layer
     * @method getUsername
     */
    public getUsername() : string {
        return this.username;
    }
 /**
     * Set username
     *
     * @class Layer
     * @method setUsername
     * @param username
     */
    public setUsername(username: string) : void {
        this.username = username;
    }
}
