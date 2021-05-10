import { IsicC } from './class_model';
import slClasses from './class_schema';

export default class CodeService {
    
    public createCode(code_params: IsicC, callback: any) {
        const _session = new slClasses(code_params);
        _session.save(callback);
    }

    public filterCode(query: any, callback: any) {
        slClasses.findOne(query, callback);
    }

    public filter(query: any, callback: any) {
        slClasses.find(query, callback);
    }


    public updateCode(code_params: IsicC, callback: any) {
        const query = { _id: code_params._id };
        slClasses.findOneAndUpdate(query, code_params, callback);
    }
    
    public deleteCode(_id: String, callback: any) {
        const query = { _id: _id };
        slClasses.deleteOne(query, callback);
    }

}