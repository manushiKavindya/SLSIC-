import * as mongoose from 'mongoose';
// import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const schema = new Schema({
    division: String,
    group: String,
    description: String,
    // modification_notes: [ModificationNote]
});

export default mongoose.model('slGroups', schema);