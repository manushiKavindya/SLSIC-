import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from 'mongoose';
import environment from "../environment";
import { UserRoutes } from "../routes/user_routes";
import { FiveDRoutes } from "../routes/fived_routes";
import { ClassRoutes } from "../routes/class_routes";
import { GroupRoutes } from "../routes/group_routes";
import { ScnRoutes } from "../routes/section_routes";
import { DivRoutes } from "../routes/division_routes";
import { TestRoutes } from "../routes/test_routes";
import { CommonRoutes } from "../routes/common_routes";


class App {
   public app: express.Application;
   public mongoUrl: string = 'mongodb://localhost/' + environment.getDBName();

   private user_routes: UserRoutes = new UserRoutes();

   private group_routes: GroupRoutes = new GroupRoutes();
   private section_routes: ScnRoutes = new ScnRoutes();
   private division_routes: DivRoutes = new DivRoutes();
   private class_routes: ClassRoutes = new ClassRoutes();
   private fived_routes: FiveDRoutes = new FiveDRoutes();

   private test_routes: TestRoutes = new TestRoutes();
   private common_routes: CommonRoutes = new CommonRoutes();


   constructor() {
      this.app = express();
      this.config();
      this.mongoSetup();
      this.user_routes.route(this.app);
      this.fived_routes.route(this.app);
      this.class_routes.route(this.app);
      this.section_routes.route(this.app);
      this.group_routes.route(this.app);
      this.division_routes.route(this.app);
      this.test_routes.route(this.app);
      this.common_routes.route(this.app);

   }
   private config(): void {
      // support application/json type post data
      this.app.use(bodyParser.json());
      //support application/x-www-form-urlencoded post data
      this.app.use(bodyParser.urlencoded({ extended: false }));

      // this.app.use(cors());
      var express = require('express');
      var cors = require('cors');
      var app = express();
      app.use(cors());

      this.app.use((req, res, next) => {
         res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
         next();
      });
   }

   private mongoSetup(): void {
      mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
   }
}
export default new App().app;