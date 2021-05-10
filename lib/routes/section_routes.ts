import { Application, Request, Response } from 'express';
import { ScnController } from '../controllers/scnController';

export class ScnRoutes {
    private section_controller: ScnController = new ScnController();

    public route(app: Application) {
        
        app.post('/api/section', (req: Request, res: Response) => {
            this.section_controller.create_scn(req, res);
        });

        app.get('/api/section/:scn_id', (req: Request, res: Response) => {
            this.section_controller.get_scn(req, res);
        });

        app.put('/api/section/:scn_id', (req: Request, res: Response) => {
            this.section_controller.update_scn(req, res);
        });

        app.delete('/api/section/:scn_id', (req: Request, res: Response) => {
            this.section_controller.delete_scn(req, res);
        });

    }

}
