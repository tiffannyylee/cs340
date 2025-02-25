export interface View {
    displayErrorMessage: (message: string) => void
}
export interface MessageView extends View{
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => void
    clearLastInfoMessage: () => void
}
export class Presenter {
    protected _isLoading: boolean
    private _view: View

    protected constructor(view: View) {
        this._view = view
        this._isLoading = false

    }
    protected get view(): View {
        return this._view
    }
    protected get isLoading(){
        return this._isLoading
    }
    protected set isLoading(value:boolean){
        this._isLoading = value
    }
    public async doFailureReportingOperation(operation: () => Promise<void>, operationDescription:string) {
        try {
            await operation()

        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to ${operationDescription} because of exception: ${error}`
          );
        }
      };

}