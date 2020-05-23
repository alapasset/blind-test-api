"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const Controller_1 = require("../controller/Controller");
class Routes {
    constructor() {
        this.controller = new Controller_1.Controller();
    }
    routes(app) {
        app.route('/')
            .get((request, response) => {
            response.status(200)
                .send({
                message: "GET request successfully."
            });
        });
        app.route('/playlist')
            .get(this.controller.getAllPlaylist)
            .post(this.controller.addPlaylist);
        app.route('/playlist/:playlistId')
            .get(this.controller.getPlaylistById)
            .put(this.controller.updatePlaylist);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=Routes.js.map