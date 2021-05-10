import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IUser } from '../modules/users/model';
import UserService from '../modules/users/service';
import e = require('express');

export class UserController {

    private user_service: UserService = new UserService();

    public create_user(req: Request, res: Response) {
        // this check whether all the filds were send through the erquest or not
        if (req.body.name && req.body.name.first_name && req.body.name.last_name &&
            req.body.username &&
            req.body.password &&
            req.body.email &&
            req.body.phone_number) {
                console.log(req.body.password);
                
            const user_params: IUser = {
                name: {
                    first_name: req.body.name.first_name,
                    last_name: req.body.name.last_name
                },                
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                phone_number: req.body.phone_number,
                modification_notes: [{
                    modified_on: new Date(Date.now()),
                    modified_by: null,
                    modification_note: 'New user created'
                }]
            };
            console.log(user_params.password);
            
            this.user_service.createUser(user_params, (err: any, user_data: IUser) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    console.log(user_data.password);
                    
                    successResponse('create user successfull', user_data, res);
                }
            });
        } else {
            // error response if some fields are missing in request body
            insufficientParameters(res);
        }
    }

    public get_user(req: Request, res: Response) {
        if (req.params.username, req.params.password) {
            const user_filter = { username: req.params.username, password: req.params.password };
            console.log(user_filter)
            this.user_service.filterUser(user_filter, (err: any, user_data: IUser) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('get user successfull', user_data, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public update_user(req: Request, res: Response) {
        if (req.params.id &&
            req.body.name || req.body.name.first_name ||  req.body.name.last_name ||
            req.body.username ||
            req.body.password ||
            req.body.email ||
            req.body.phone_number) {
            const user_filter = { _id: req.params.id };
            this.user_service.filterUser(user_filter, (err: any, user_data: IUser) => {
                if (err) {
                    mongoError(err, res);
                } else if (user_data) {
                    user_data.modification_notes.push({
                        modified_on: new Date(Date.now()),
                        modified_by: null,
                        modification_note: 'User data updated'
                    });
                    const user_params: IUser = {
                        _id: req.params.id,
                        name: req.body.name ? {
                            first_name: req.body.name.first_name ? req.body.name.first_name : user_data.name.first_name,
                            last_name: req.body.name.first_name ? req.body.name.last_name : user_data.name.last_name
                        } : user_data.name,
                        username: req.body.username ? req.body.username : user_data.username,
                        password: req.body.password ? req.body.password : user_data.password,
                        email: req.body.email ? req.body.email : user_data.email,
                        phone_number: req.body.phone_number ? req.body.phone_number : user_data.phone_number,
                        is_deleted: req.body.is_deleted ? req.body.is_deleted : user_data.is_deleted,
                        modification_notes: user_data.modification_notes
                    };
                    this.user_service.updateUser(user_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            successResponse('update user successfull', null, res);
                        }
                    });
                } else {
                    failureResponse('invalid user', null, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public delete_user(req: Request, res: Response) {
        if (req.params.id) {
            this.user_service.deleteUser(req.params.id, (err: any, delete_details) => {
                if (err) {
                    mongoError(err, res);
                } else if (delete_details.deletedCount !== 0) {
                    successResponse('delete user successfull', null, res);
                } else {
                    failureResponse('invalid user', null, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }
}