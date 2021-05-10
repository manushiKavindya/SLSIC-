import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IsicD } from 'modules/slDivisions/D_model';
import DivService from '../modules/slDivisions/D_service';
import { IsicS } from 'modules/slSections/S_model';
import SectionService from '../modules/slSections/S_service';

import e = require('express');


export class ScnController {
    private division_service: DivService = new DivService();
    private section_service: SectionService = new SectionService();

    public create_scn(req: Request, res: Response) {
        // this check whether all the filds were send through the erquest or not
        if (req.body.section && req.body.description) {
            const scn_params: IsicS = {
                section: req.body.section,
                description: req.body.description
                // modification_notes: [{
                //     modified_on: new Date(Date.now()),
                //     modified_by: null,
                //     modification_note: 'New code inserted'
                // }]
            };
            this.section_service.createCode(scn_params, (err: any, code_data: IsicS) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('Create code successfull', code_data, res);
                }
            });
        } else {
            // error response if some fields are missing in request body
            insufficientParameters(res);
        }
    }

    public get_scn(req: Request, res: Response) {
        let returnObj: any = [];
        if (req.params.scn_id) {
            let section_filter = { $or: [{ section: req.params.scn_id }, { description: { $regex: req.params.scn_id } }] };
            this.section_service.filter(section_filter, (err: any, section_list: IsicS[]) => {
                if (err) {
                    mongoError(err, res);
                } else if (section_list && section_list.length > 0) {
                    console.log(section_list)
                    section_list.forEach((scnObj, index: number) => {
                        let sectionDetail = {
                            section_id: scnObj.section,
                            section_description: scnObj.description,
                            sub_list: []
                        }
                        let section_filter = { section: scnObj.section};
                        this.division_service.filter(section_filter, (err: any, divList: IsicD[]) => {
                            if (err) {
                                mongoError(err, res);
                            } else {
                                sectionDetail.sub_list.push(divList.map(divS => {
                                    return {
                                        division_id: divS.division,
                                        division_description: divS.description
                                    }
                                }));
                                returnObj.push(sectionDetail);
                                if (index == section_list.length - 1) {
                                    successResponse('Get code successfull', returnObj, res);
                                }
                            }
                        });
                    });
                } else {
                    successResponse('invalid id', returnObj, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public update_scn(req: Request, res: Response) {
        if (req.params.id &&
            req.body.section || req.body.description) {
            const code_filter = { _id: req.params.id };
            this.section_service.filterCode(code_filter, (err: any, code_data: IsicS) => {
                if (err) {
                    mongoError(err, res);
                } else if (code_data) {
                    // code_data.modification_notes.push({
                    //     modified_on: new Date(Date.now()),
                    //     modified_by: null,
                    //     modification_note: 'Code data updated'
                    // });
                    const scn_params: IsicS = {
                        _id: req.params.id,
                        section: req.body.section ? req.body.section : code_data.section,
                        description: req.body.description ? req.body.description : code_data.description,
                        is_deleted: req.body.is_deleted ? req.body.is_deleted : code_data.is_deleted,
                        // modification_notes: code_data.modification_notes
                    };
                    this.section_service.updateCode(scn_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            successResponse('Update code successfull', null, res);
                        }
                    });
                } else {
                    failureResponse('Invalid code', null, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public delete_scn(req: Request, res: Response) {
        if (req.params.id) {
            this.section_service.deleteCode(req.params.id, (err: any, delete_details) => {
                if (err) {
                    mongoError(err, res);
                } else if (delete_details.deletedCount !== 0) {
                    successResponse('Delete code successfull', null, res);
                } else {
                    failureResponse('Invalid code', null, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

}
