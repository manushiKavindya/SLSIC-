// import { ModificationNote } from "../common/model";

export interface IsicS {
    _id?:String,
    section: String,
    description: String,

    is_deleted?: Boolean;
    // modification_notes: ModificationNote[]
}