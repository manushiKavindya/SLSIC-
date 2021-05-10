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

export class FiveDController {

    private fiveD_service: FiveDService = new FiveDService();
    private class_service: ClassService = new ClassService();
    private group_service: GroupService = new GroupService();
    private div_service: DivService = new DivService();
    private scn_service: ScnService = new ScnService();


    public create_fiveD(req: Request, res: Response) {
        // this check whether all the filds were send through the erquest or not
        if (req.body.Class && req.body.FiveD && req.body.Description) {
            const fiveD_params: IsicF = {
                class: req.body.class,
                fived: req.body.fived,
                description: req.body.description,
                // modification_notes: [{
                //     modified_on: new Date(Date.now()),
                //     modified_by: null,
                //     modification_note: 'New code inserted'
                // }]
            };
            this.fiveD_service.createCode(fiveD_params, (err: any, fiveD_data: IsicF) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('Create code successfull', fiveD_data, res);
                }
            });
        } else {
            // error response if some fields are missing in request body
            insufficientParameters(res);
        }
    }

    public get_fiveD(req: Request, res: Response) {
        let returnObj: any = {};
        if (req.params.fived_id) {
            let fiveD_filter = { $or: [{ fived: req.params.fived_id }, { description: { $regex: req.params.fived_id } }] };
            this.fiveD_service.filter(fiveD_filter, (err: any, fiveD_data: IsicF[]) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    if (fiveD_data) {
                        returnObj = [];
                        let fClasses = fiveD_data.map(data => data.class);
                        fiveD_data.forEach(data => {
                            let fived = {
                                _id: data._id,
                                class: data.class,
                                fived: data.fived,
                                description: data.description
                            }
                            returnObj.push(fived);
                        });
                        // console.log(returnObj.data);
                        let class_filter = { class: { $in: fClasses } };
                        this.class_service.filter(class_filter, (err: any, class_data: IsicC[]) => {
                            if (err) {
                                mongoError(err, res);
                            } else {
                                console.log('here one');
                                returnObj.forEach(fC => {
                                    class_data.forEach(classData => {
                                        if (fC.class === classData.class) {
                                            fC.classDescription = classData.description;
                                            fC.group = classData.group;
                                        }
                                    });
                                });
                                if (class_data) {
                                    let fGroups = class_data.map(data => data.group);
                                    let group_filter = { group: { $in: fGroups } };
                                    this.group_service.filter(group_filter, (err: any, group_data: IsicG[]) => {
                                        if (err) {
                                            mongoError(err, res);
                                        } else {
                                            console.log('here four');
                                            returnObj.forEach(fG => {
                                                group_data.forEach(groupData => {
                                                    if (fG.group === groupData.group) {
                                                        fG.groupDescription = groupData.description;
                                                        fG.division = groupData.division;
                                                    }
                                                });
                                            });
                                            if (group_data) {
                                                let fDivs = group_data.map(data => data.division);
                                                console.log(fDivs);
                                                let div_filter = { division: { $in: fDivs } };
                                                this.div_service.filter(div_filter, (err: any, div_data: IsicD[]) => {
                                                    if (err) {
                                                        mongoError(err, res);
                                                    } else {
                                                        console.log('here five');
                                                        returnObj.forEach(fD => {
                                                            div_data.forEach(divData => {
                                                                if (fD.division === divData.division) {
                                                                    fD.divDescription = divData.description;
                                                                    fD.section = divData.section;
                                                                }
                                                            });
                                                        });
                                                        if (div_data) {
                                                            let fScns = div_data.map(data => data.section);
                                                            console.log(fScns);
                                                            let scn_filter = { section: { $in: fScns } };
                                                            this.scn_service.filter(scn_filter, (err: any, scn_data: IsicS[]) => {
                                                                if (err) {
                                                                    mongoError(err, res);
                                                                } else {
                                                                    console.log('here six');
                                                                    returnObj.forEach(fS => {
                                                                        scn_data.forEach(scnData => {
                                                                            if (fS.section === scnData.section) {
                                                                                fS.scnDescription = scnData.description;
                                                                            }
                                                                        });
                                                                    });

                                                                    successResponse('Get code successfull', returnObj, res);
                                                                }
                                                            });
                                                        } else {
                                                            successResponse('Get code successfull', returnObj, res);
                                                        }
                                                    }
                                                });
                                            } else {
                                                successResponse('Get code successfull', returnObj, res);
                                            };
                                        }
                                    });
                                } else {
                                    successResponse('Get code successfull', returnObj, res);
                                }
                            }
                        });
                    }
                    else {
                        successResponse('Get code successfull', fiveD_data, res);
                    }
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public update_fiveD(req: Request, res: Response) {
        if (req.params.id &&
            req.body.Class || req.body.FiveD || req.body.Description) {
            const fiveD_filter = { _id: req.params.id };
            this.fiveD_service.filterCode(fiveD_filter, (err: any, fiveD_data: IsicF) => {
                if (err) {
                    mongoError(err, res);
                } else if (fiveD_data) {
                    // fiveD_data.modification_notes.push({
                    //     modified_on: new Date(Date.now()),
                    //     modified_by: null,
                    //     modification_note: 'FiveD data updated'
                    // });
                    const fiveD_params: IsicF = {
                        _id: req.params.id,
                        class: req.body.Class ? req.body.class : fiveD_data.class,
                        fived: req.body.FiveD ? req.body.fived : fiveD_data.fived,
                        description: req.body.Description ? req.body.Description : fiveD_data.description,
                        is_deleted: req.body.is_deleted ? req.body.is_deleted : fiveD_data.is_deleted,
                        // modification_notes: fiveD_data.modification_notes
                    };
                    this.fiveD_service.updateCode(fiveD_params, (err: any) => {
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

    public delete_fiveD(req: Request, res: Response) {
        if (req.params.id) {
            this.fiveD_service.deleteCode(req.params.id, (err: any, delete_details) => {
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