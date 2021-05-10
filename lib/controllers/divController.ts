import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IsicG } from 'modules/slGroups/G_model';
import GroupService from '../modules/slGroups/G_service';
import { IsicD } from 'modules/slDivisions/D_model';
import DivService from '../modules/slDivisions/D_service';
import { IsicS } from 'modules/slSections/S_model';
import ScnService from '../modules/slSections/S_service';



import e = require('express');


export class DivController {
    private group_service: GroupService = new GroupService();
    private div_service: DivService = new DivService();
    private scn_service: ScnService = new ScnService();


    public create_div(req: Request, res: Response) {
        // this check whether all the filds were send through the erquest or not
        if (req.body.Section && req.body.Division && req.body.Description) {
            const div_params: IsicD = {
                section: req.body.Section,
                division: req.body.Division,
                description: req.body.Description,
                // modification_notes: [{
                //     modified_on: new Date(Date.now()),
                //     modified_by: null,
                //     modification_note: 'New code inserted'
                // }]
            };
            this.div_service.createCode(div_params, (err: any, code_data: IsicD) => {
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

    public get_div(req: Request, res: Response) {
        let returnObj: any = [];
        if (req.params.div_id) {
            let division_filter = { $or: [{ division: req.params.div_id }, { description: { $regex: req.params.div_id } }] };
            this.div_service.filter(division_filter, (err: any, division_list: IsicD[]) => {
                if (err) {
                    mongoError(err, res);
                } else if (division_list && division_list.length > 0) {
                    console.log(division_list)
                    division_list.forEach((divisionObj, index: number) => {
                        let divisionDetail = {
                            division_id: divisionObj.division,
                            division_description: divisionObj.description,
                            group_id: divisionObj.division,
                            group_description: divisionObj.description,
                            section_id: divisionObj.division,
                            section_description: divisionObj.description,
                            sub_list: []
                        }
                        let group_filter = { division: divisionObj.division };
                        this.group_service.filter(group_filter, (err: any, groupList: IsicG[]) => {
                            if (err) {
                                mongoError(err, res);
                            } else {
                                divisionDetail.sub_list.push(groupList.map(groupD => {
                                    return {
                                        group_id: groupD.group,
                                        group_description: groupD.description
                                    }
                                }));
                                let section_filter = { section: divisionObj.section }
                                this.scn_service.filterCode(section_filter, (err: any, sectionDetails: IsicS) => {
                                    if (err) {
                                        mongoError(err, res);
                                    } else {
                                        divisionDetail.section_id = sectionDetails.section;
                                        divisionDetail.section_description = sectionDetails.description;
                                        returnObj.push(divisionDetail);
                                        if (index == division_list.length - 1) {
                                            successResponse('Get code successfull', returnObj, res);
                                        }
                                    }
                                });
                            }
                        });
                    });
                } else {
                    //invalid id
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public update_div(req: Request, res: Response) {
        if (req.params.id &&
            req.body.division || req.body.section || req.body.description) {
            const class_filter = { _id: req.params.id };
            this.div_service.filterCode(class_filter, (err: any, code_data: IsicD) => {
                if (err) {
                    mongoError(err, res);
                } else if (code_data) {
                    // code_data.modification_notes.push({
                    //     modified_on: new Date(Date.now()),
                    //     modified_by: null,
                    //     modification_note: 'Code data updated'
                    // });
                    const div_params: IsicD = {
                        _id: req.params.id,
                        division: req.body.division ? req.body.division : code_data.division,
                        section: req.body.section ? req.body.section : code_data.section,
                        description: req.body.Description ? req.body.Description : code_data.description,
                        is_deleted: req.body.is_deleted ? req.body.is_deleted : code_data.is_deleted,
                        // modification_notes: code_data.modification_notes
                    };
                    this.div_service.updateCode(div_params, (err: any) => {
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

    public delete_div(req: Request, res: Response) {
        if (req.params.id) {
            this.div_service.deleteCode(req.params.id, (err: any, delete_details) => {
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
