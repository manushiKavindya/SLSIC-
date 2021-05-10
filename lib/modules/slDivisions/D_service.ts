import { IsicD } from './D_model';
import slDivisions from './D_schema';

export default class CodeService {
    
    public createCode(code_params: IsicD, callback: any) {
        const _session = new slDivisions(code_params);
        _session.save(callback);
    }

    public filterCode(query: any, callback: any) {
        slDivisions.findOne(query, callback);
    }

    public filter(query: any, callback: any) {
        slDivisions.find(query, callback);
    }


    public updateCode(code_params: IsicD, callback: any) {
        const query = { _id: code_params._id };
        slDivisions.findOneAndUpdate(query, code_params, callback);
    }
    
    public deleteCode(_id: String, callback: any) {
        const query = { _id: _id };
        slDivisions.deleteOne(query, callback);
    }

}