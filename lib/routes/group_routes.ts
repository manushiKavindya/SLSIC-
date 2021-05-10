import { Application, Request, Response } from 'express';
import { GroupController } from '../controllers/groupController';

export class GroupRoutes {
    private group_controller: GroupController = new GroupController();

    public route(app: Application) {
        
        app.post('/api/group', (req: Request, res: Response) => {
            this.group_controller.create_group(req, res);
        });

        app.get('/api/group/:group_id', (req: Request, res: Response) => {
            this.group_controller.get_group(req, res);
        });

        app.put('/api/group/:group_id', (req: Request, res: Response) => {
            this.group_controller.update_group(req, res);
        });

        app.delete('/api/group/:group_id', (req: Request, res: Response) => {
            this.group_controller.delete_group(req, res);
        });

    }

}