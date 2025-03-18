import { Status } from "tweeter-shared";
import { View } from "./Presenter";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { StatusService } from "../model/StatusService";


export interface StatusItemView extends View{
    addItems:(newItems: Status []) => void
    //functions from the component that the view will call on the presenter
}
export abstract class StatusItemPresenter extends PagedItemPresenter<Status, StatusService>{

    protected createService(): StatusService {
        return new StatusService();
    };

}