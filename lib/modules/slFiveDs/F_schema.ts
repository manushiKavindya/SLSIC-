import * as mongoose from 'mongoose';
// import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const schema = new Schema({
    class: String,
    fived: String,
    description: String,
    // modification_notes: [ModificationNote]
});

export default mongoose.model('slFiveDs', schema);