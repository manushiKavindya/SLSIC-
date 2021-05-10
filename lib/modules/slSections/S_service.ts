import { IsicS } from './S_model';
import slSections from './S_schema';

export default class CodeService {
    
    public createCode(code_params: IsicS, callback: any) {
        const _session = new slSections(code_params);
        _session.save(callback);
    }

    public filterCode(query: any, callback: any) {
        slSections.findOne(query, callback);
    }
    
    public filter(query: any, callback: any) {
        slSections.find(query, callback);
    }

    public updateCode(code_params: IsicS, callback: any) {
        const query = { _id: code_params._id };
        slSections.findOneAndUpdate(query, code_params, callback);
    }
    
    public deleteCode(_id: String, callback: any) {
        const query = { _id: _id };
        slSections.deleteOne(query, callback);
    }

}