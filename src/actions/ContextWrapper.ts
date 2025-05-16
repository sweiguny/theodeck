export class ContextWrapper {
    private _lastImage: string;

    constructor(private readonly context: any) {
        this.context = context;
        this._lastImage = "imgs/plugin/LOREM_PICSUM.png";
    }

    // Original-Funktion delegieren
    public setImage(data: string) {
        this.context.setImage(data);
    }

    // Getter und Setter für lastImage
    public set lastImage(dataUrl: string) {
        this._lastImage = dataUrl;
    }

    public get lastImage(): string {
        return this._lastImage;
    }

    public get raw(): any {
        return this.context;
    }
}