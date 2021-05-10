import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IsicF } from '../modules/slFiveDs/F_model';
import FiveDService from '../modules/slFiveDs/F_service';
import { IsicC } from 'modules/slClasses/class_model';
import ClassService from '../modules/slClasses/class_service';
import { IsicG } from 'modules/slGroups/G_model';
import GroupService from '../modules/slGroups/G_service';
import { IsicD } from 'modules/slDivisions/D_model';
import DivService from '../modules/slDivisions/D_service';
import { IsicS } from 'modules/slSections/S_model';
import ScnService from '../modules/slSections/S_service';



import e = require('express');


export class ClassController {

    private fiveD_service: FiveDService = new FiveDService();
    private class_service: ClassService = new ClassService();
    private group_service: GroupService = new GroupService();
    private div_service: DivService = new DivService();
    private scn_service: ScnService = new ScnService();


    public create_class(req: Request, res: Response) {
        // this check whether all the filds were send through the erquest or not
        if (req.body.Group && req.body.Class && req.body.Description) {
            const class_params: IsicC = {
                group: req.body.Group,
                class: req.body.Class,
                description: req.body.Description,
                // modification_notes: [{
                //     modified_on: new Date(Date.now()),
                //     modified_by: null,
                //     modification_note: 'New code inserted'
                // }]
            };
            this.class_service.createCode(class_params, (err: any, code_data: IsicC) => {
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

    public update_class(req: Request, res: Response) {
        if (req.params.id &&
            req.body.class || req.body.group || req.body.description) {
            const class_filter = { _id: req.params.id };
            this.class_service.filterCode(class_filter, (err: any, code_data: IsicC) => {
                if (err) {
                    mongoError(err, res);
                } else if (code_data) {
                    // code_data.modification_notes.push({
                    //     modified_on: new Date(Date.now()),
                    //     modified_by: null,
                    //     modification_note: 'Code data updated'
                    // });
                    const code_params: IsicC = {
                        _id: req.params.id,
                        class: req.body.class ? req.body.class : code_data.class,
                        group: req.body.group ? req.body.group : code_data.group,
                        description: req.body.description ? req.body.description : code_data.description,
                        is_deleted: req.body.is_deleted ? req.body.is_deleted : code_data.is_deleted,
                        // modification_notes: code_data.modification_notes
                    };
                    this.class_service.updateCode(code_params, (err: any) => {
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

    public delete_class(req: Request, res: Response) {
        if (req.params.id) {
            this.class_service.deleteCode(req.params.id, (err: any, delete_details) => {
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


    public get_class(req: Request, res: Response) {
        let returnObj: any = [];
        if (req.params.class_id) {
            let class_filter = { $or: [{ class: req.params.class_id }, { description: { $regex: req.params.class_id } }] };
            this.class_service.filter(class_filter, (err: any, class_list: IsicC[]) => {
                if (err) {
                    mongoError(err, res);
                } else if (class_list && class_list.length > 0) {
                    console.log(class_list)
                    class_list.forEach((classObj, index: number) => {
                        let classDetail = {
                            class_id: classObj.class,
                            class_description: classObj.description,
                            group_id: classObj.class,
                            group_description: classObj.description,
                            division_id: classObj.class,
                            division_description: classObj.description,
                            section_id: classObj.class,
                            section_description: classObj.description,
                            sub_list: []
                        }
                        let class_filter = { class: classObj.class };
                        this.fiveD_service.filter(class_filter, (err: any, fivedList: IsicF[]) => {
                            if (err) {
                                mongoError(err, res);
                            } else {
                                classDetail.sub_list.push(fivedList.map(fived => {
                                    return {
                                        fived_id: fived.fived,
                                        fived_description: fived.description
                                    }
                                }));
                                let group_filter = { group: classObj.group }
                                this.group_service.filterCode(group_filter, (err: any, groupDetails: IsicG) => {
                                    if (err) {
                                        mongoError(err, res);
                                    } else {
                                        classDetail.group_id = groupDetails.group;
                                        classDetail.group_description = groupDetails.description;
                                        let division_filter = { division: groupDetails.division }
                                        this.div_service.filterCode(division_filter, (err: any, divisionDetails: IsicD) => {
                                            if (err) {
                                                mongoError(err, res);
                                            } else {
                                                classDetail.division_id = divisionDetails.division;
                                                classDetail.division_description = divisionDetails.description;
                                                let section_filter = { section: divisionDetails.section }
                                                this.scn_service.filterCode(section_filter, (err: any, sectionDetails: IsicS) => {
                                                    if (err) {
                                                        mongoError(err, res);
                                                    } else {
                                                        classDetail.section_id = sectionDetails.section;
                                                        classDetail.section_description = sectionDetails.description;
                                                        returnObj.push(classDetail);
                                                        if (index == class_list.length - 1) {
                                                            successResponse('Get code successfull', returnObj, res);
                                                        }
                                                    }
                                                });
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