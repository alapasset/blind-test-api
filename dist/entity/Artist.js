"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Artist = void 0;
const typeorm_1 = require("typeorm");
const Track_1 = require("./Track");
let Artist = /** @class */ (() => {
    let Artist = class Artist {
    };
    __decorate([
        typeorm_1.PrimaryColumn(),
        __metadata("design:type", String)
    ], Artist.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Artist.prototype, "name", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Artist.prototype, "url", void 0);
    __decorate([
        typeorm_1.ManyToMany(type => Track_1.default),
        typeorm_1.JoinTable(),
        __metadata("design:type", Array)
    ], Artist.prototype, "tracks", void 0);
    Artist = __decorate([
        typeorm_1.Entity()
    ], Artist);
    return Artist;
})();
exports.Artist = Artist;
exports.default = Artist;
//# sourceMappingURL=Artist.js.map