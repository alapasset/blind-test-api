"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const SpotifyWebApi = require("spotify-web-api-node");
const Playlist_1 = require("../entity/Playlist");
const typeorm_1 = require("typeorm");
class Controller {
    constructor() {
        this.connection = typeorm_1.createConnection();
        this.accessTokenEpoch = 0;
        this.spotifyApi = new SpotifyWebApi({
            clientId: 'f80117db049c42f18beba3911fe96479',
            clientSecret: 'e9c4343b58484480ae6a8a1d122f12f6',
        });
    }
    checkAccessToken() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (Date.now() > (this.accessTokenEpoch - 300)) {
                try {
                    const data = yield this.spotifyApi.clientCredentialsGrant();
                    this.accessTokenEpoch = Date.now() + data.body.expires_in;
                    this.spotifyApi.setAccessToken(data.body.access_token);
                    resolve();
                }
                catch (error) {
                    reject();
                }
            }
            else {
                resolve();
            }
        }));
    }
    getAllPlaylist(req, res) {
        this.connection
            .then((connection) => __awaiter(this, void 0, void 0, function* () {
            const Playlistes = yield connection.manager.find(Playlist_1.default);
            res.json(Playlistes);
        }))
            .catch(error => {
            console.error("Error ", error);
            res.json(error);
        });
    }
    addPlaylist(req, res) {
        this.connection
            .then((connection) => __awaiter(this, void 0, void 0, function* () {
            yield this.checkAccessToken();
            let playlistToAdd = yield this.spotifyApi.getPlaylist(req.body.playlistId);
            let playlist = new Playlist_1.default();
            playlist.id = playlistToAdd.body.id;
            playlist.name = playlistToAdd.body.name;
            yield connection.manager.save(playlist);
            res.json({ message: "Successfully Saved." });
        }))
            .catch(error => {
            console.error("Error ", error);
            res.json(error);
        });
    }
    updatePlaylist(req, res) {
        this.connection
            .then((connection) => __awaiter(this, void 0, void 0, function* () {
            let playlist = yield connection.manager.findOne(Playlist_1.default, req.params.playlistId);
            let requestPlaylist = req.body;
            playlist.name = requestPlaylist.name;
            yield connection.manager.save(playlist);
            res.json({ message: "Successfully Updated." });
        }))
            .catch(error => {
            console.error("Error ", error);
            res.json(error);
        });
    }
    getPlaylistById(req, res) {
        this.connection
            .then((connection) => __awaiter(this, void 0, void 0, function* () {
            let playlist = yield connection.manager.findOne(Playlist_1.default, req.params.playlistId);
            res.json(playlist);
        }))
            .catch(error => {
            console.error("Error ", error);
            res.json(error);
        });
    }
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map