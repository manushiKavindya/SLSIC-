import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IsicC } from 'modules/slClasses/class_model';
import ClassService from '../modules/slClasses/class_service';
import { IsicG } from 'modules/slGroups/G_model';
import GroupService from '../modules/slGroups/G_service';
import { IsicD } from 'modules/slDivisions/D_model';
import DivService from '../modules/slDivisions/D_service';
import { IsicS } from 'modules/slSections/S_model';
import ScnService from '../modules/slSections/S_service';




import e = require('express');


export class GroupController {
    private class_service: ClassService = new ClassService();
    private group_service: GroupService = new GroupService();
    private div_service: DivService = new DivService();
    private scn_service: ScnService = new ScnService();


    public create_group(req: Request, res: Response) {
        // this check whether all the filds were send through the erquest or not
        if (req.body.Group && req.body.Division && req.body.Description) {
            const group_params: IsicG = {
                group: req.body.group,
                division: req.body.division,
                description: req.body.description,
                // modification_notes: [{
                //     modified_on: new Date(Date.now()),
                //     modified_by: null,
                //     modification_note: 'New code inserted'
                // }]
            };
            this.group_service.createCode(group_params, (err: any, code_data: IsicG) => {
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

    public delete_group(req: Request, res: Response) {
        if (req.params.id) {
            this.group_service.deleteCode(req.params.id, (err: any, delete_details) => {
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

    public update_group(req: Request, res: Response) {
        if (req.params.id &&
            req.body.division || req.body.group || req.body.description) {
            const class_filter = { _id: req.params.id };
            this.group_service.filterCode(class_filter, (err: any, code_data: IsicG) => {
                if (err) {
                    mongoError(err, res);
                } else if (code_data) {
                    // code_data.modification_notes.push({
                    //     modified_on: new Date(Date.now()),
                    //     modified_by: null,
                    //     modification_note: 'Code data updated'
                    // });
                    const group_params: IsicG = {
                        _id: req.params.id,
                        division: req.body.division ? req.body.division : code_data.division,
                        group: req.body.group ? req.body.group : code_data.group,
                        description: req.body.description ? req.body.description : code_data.description,
                        is_deleted: req.body.is_deleted ? req.body.is_deleted : code_data.is_deleted,
                        // modification_notes: code_data.modification_notes
                    };
                    this.group_service.updateCode(group_params, (err: any) => {
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

    public get_group(req: Request, res: Response) {
        let returnObj: any = [];
        if (req.params.group_id) {
            let group_filter = { $or: [{ group: req.params.group_id }, { description: { $regex: req.params.group_id } }] };
            this.group_service.filter(group_filter, (err: any, group_list: IsicG[]) => {
                if (err) {
                    mongoError(err, res);
                } else if (group_list && group_list.length > 0) {
                    console.log(group_list)
                    group_list.forEach((groupObj, index: number) => {
                        let groupDetail = {
                            group_id: groupObj.group,
                            group_description: groupObj.description,
                            division_id: groupObj.group,
                            division_description: groupObj.description,
                            section_id: groupObj.group,
                            section_description: groupObj.description,
                            sub_list: []
                        }
                        let group_filter = { group: groupObj.group };
                        this.class_service.filter(group_filter, (err: any, classList: IsicC[]) => {
                            if (err) {
                                mongoError(err, res);
                            } else {
                                groupDetail.sub_list.push(classList.map(classG => {
                                    return {
                                        class_id: classG.class,
                                        class_description: classG.description
                                    }
                                }));
                                let division_filter = { division: groupObj.division }
                                this.div_service.filterCode(division_filter, (err: any, divisionDetails: IsicD) => {
                                    if (err) {
                                        mongoError(err, res);
                                    } else {
                                        groupDetail.division_id = divisionDetails.division;
                                        groupDetail.division_description = divisionDetails.description;
                                        let section_filter = { section: divisionDetails.section }
                                        this.div_service.filterCode(section_filter, (err: any, sectionDetails: IsicS) => {
                                            if (err) {
                                                mongoError(err, res);
                                            } else {
                                                groupDetail.section_id = sectionDetails.section;
                                                groupDetail.section_description = sectionDetails.description;
                                                returnObj.push(groupDetail);
                                                if (index == group_list.length - 1) {
                                                    successResponse('Get code successfull', returnObj, res);
                                                }
                                            }
                                        });
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
}
