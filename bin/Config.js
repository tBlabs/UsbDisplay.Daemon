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
const inversify_1 = require("inversify");
const StartupArgs_1 = require("./services/env/StartupArgs");
let Config = class Config {
    constructor(_args) {
        this._args = _args;
    }
    get Port() {
        const portFromArgs = this._args.Args.port;
        if (portFromArgs === undefined) {
            throw new Error(`No "port" defined (example: "--port 3000")`);
        }
        return portFromArgs;
    }
    get Serial() {
        const serialFromArgs = this._args.Args.serial;
        if (serialFromArgs === undefined) {
            throw new Error(`No "serial" defined (example: "--serial /dev/ttyUSB0" or "--serial /dev/ttyS0")`);
        }
        return serialFromArgs;
    }
    get Log() {
        const log = this._args.Args.log || false;
        return log;
    }
};
Config = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [StartupArgs_1.StartupArgs])
], Config);
exports.Config = Config;
//# sourceMappingURL=Config.js.map