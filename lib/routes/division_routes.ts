import { Application, Request, Response } from 'express';
import { DivController } from '../controllers/divController';

export class DivRoutes {
    private division_controller: DivController = new DivController();

    public route(app: Application) {
        
        app.post('/api/division', (req: Request, res: Response) => {
            this.division_controller.create_div(req, res);
        });

        app.get('/api/division/:div_id', (req: Request, res: Response) => {
            this.division_controller.get_div(req, res);
        });

        app.put('/api/division/:div_id', (req: Request, res: Response) => {
            this.division_controller.update_div(req, res);
        });

        app.delete('/api/division/:div_id', (req: Request, res: Response) => {
            this.division_controller.delete_div(req, res);
        });

    }

}