import { Application, Request, Response } from 'express';
import { FiveDController } from '../controllers/fiveDController';

export class FiveDRoutes {

    private fiveD_controller: FiveDController = new FiveDController();

    public route(app: Application) {
        
        app.post('/api/fiveD', (req: Request, res: Response) => {
            this.fiveD_controller.create_fiveD(req, res);
        });

        app.get('/api/fiveD/:fived_id', (req: Request, res: Response) => {
            this.fiveD_controller.get_fiveD(req, res);
        });

        app.put('/api/fiveD/:fived_id', (req: Request, res: Response) => {
            this.fiveD_controller.update_fiveD(req, res);
        });

        app.delete('/api/fiveD/:five_id', (req: Request, res: Response) => {
            this.fiveD_controller.delete_fiveD(req, res);
        });

    }

}