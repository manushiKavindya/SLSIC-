import { IsicF } from './F_model';
import slFiveDs from './F_schema';

export default class CodeService {
    
    public createCode(code_params: IsicF, callback: any) {
        const _session = new slFiveDs(code_params);
        _session.save(callback);
    }

    public filterCode(query: any, callback: any) {
        slFiveDs.findOne(query, callback);
    }

    public filter(query: any, callback: any) {
        slFiveDs.find(query, callback);
    }

    public updateCode(code_params:IsicF, callback: any) {
        const query = { _id: code_params._id };
        slFiveDs.findOneAndUpdate(query, code_params, callback);
    }
    
    public deleteCode(_id: String, callback: any) {
        const query = { _id: _id };
        slFiveDs.deleteOne(query, callback);
    }

}