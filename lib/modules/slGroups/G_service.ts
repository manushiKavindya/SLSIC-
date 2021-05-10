import { IsicG } from './G_model';
import slGroups from './G_schema';

export default class CodeService {
    
    public createCode(code_params: IsicG, callback: any) {
        const _session = new slGroups(code_params);
        _session.save(callback);
    }

    public filterCode(query: any, callback: any) {
        slGroups.findOne(query, callback);
    }

    public filter(query: any, callback: any) {
        slGroups.find(query, callback);
    }


    public updateCode(code_params: IsicG, callback: any) {
        const query = { _id: code_params._id };
        slGroups.findOneAndUpdate(query, code_params, callback);
    }
    
    public deleteCode(_id: String, callback: any) {
        const query = { _id: _id };
        slGroups.deleteOne(query, callback);
    }

}