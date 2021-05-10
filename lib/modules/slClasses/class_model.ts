// import { ModificationNote } from "../common/model";

export interface IsicC {
    _id?:String,
    group: String,
    class: String,
    description: String,

    is_deleted?: Boolean;
    // modification_notes: ModificationNote[]
}