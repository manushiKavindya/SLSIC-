import { Application, Request, Response } from 'express';
import { ClassController } from '../controllers/classController';

export class ClassRoutes {
    private class_controller: ClassController = new ClassController();

public route(app: Application) {
    
    app.post('/api/class', (req: Request, res: Response) => {
        this.class_controller.create_class(req, res);
    });

    app.get('/api/class/:class_id', (req: Request, res: Response) => {
        this.class_controller.get_class(req, res);
    });

    app.put('/api/class/:class_id', (req: Request, res: Response) => {
        this.class_controller.update_class(req, res);
    });

    app.delete('/api/class/:class_id', (req: Request, res: Response) => {
        this.class_controller.delete_class(req, res);
    });

}

}