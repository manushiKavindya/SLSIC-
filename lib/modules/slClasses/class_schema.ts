import * as mongoose from 'mongoose';
// import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const schema = new Schema({
    group: String,
    class: String,
    description: String,
    // modification_notes: [ModificationNote]
});

export default mongoose.model('slClasses', schema);