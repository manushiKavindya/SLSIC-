// import { ModificationNote } from "../common/model";

export interface IsicD {
    _id?:String,
    section: String,
    division: String,
    description: String,

    is_deleted?: Boolean;
    // modification_notes: ModificationNote[]
}