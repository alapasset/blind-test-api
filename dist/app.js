"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Routes_1 = require("./routes/Routes");
const bodyParser = require("body-parser");
const cors = require("cors");
class App {
    constructor() {
        this.app = express();
        this.app.use(cors());
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.routePrv = new Routes_1.Routes();
        this.routePrv.routes(this.app);
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map