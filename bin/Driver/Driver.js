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
exports.Driver = void 0;
require("reflect-metadata");
const FluentBuilder_1 = require("../utils/FluentBuilder/FluentBuilder");
const inversify_1 = require("inversify");
const Serial_1 = require("./Serial");
const Logger_1 = require("../services/logger/Logger");
let Driver = class Driver {
    constructor(_log) {
        this._log = _log;
        this.serial = new Serial_1.Serial();
    }
    async Disconnect() {
        await this.serial.Disconnect();
    }
    Connect(port, onConnectionCallback) {
        this.serial.OnConnection(() => {
            if (onConnectionCallback)
                onConnectionCallback();
        });
        this.serial.OnData((data) => {
            // this._log.Log('Response from serial: ' + JSON.stringify(data));
            // data.forEach(b => parser.Parse(b));
        });
        // const parserBuilder = new FluentParserBuilder<BluePillBoardParserData>();
        // const parser = parserBuilder
        //     .Is(0xAB)
        //     .If(ResponseFrameType.Pong, 'type', _ => _)
        //     .IsXor()
        //     .Build();
        // parser.OnComplete((out: BluePillBoardParserData) =>
        // {
        // });
        // let faultsCounter = 0;
        // parser.OnFault((reason, frame) =>
        // {
        //     faultsCounter++;
        //     // if ((faultsCounter % 100) === 0) console.log('FAULTs', faultsCounter);
        //     console.log(`FAULT ${faultsCounter}: ${reason}`);
        // });
        this.serial.Connect(port, 19200);
    }
    Set(value, animation, rotation) {
        const frame = (new FluentBuilder_1.FluentBuilder())
            .Byte(6) // VALUE_SET
            .Byte(4) // size
            .Word2LE(value)
            .Byte(animation)
            .Byte(rotation)
            .Xor()
            .Build();
        this.serial.Send(frame);
    }
    KeepAlive() {
        const frame = (new FluentBuilder_1.FluentBuilder())
            .Byte(5) // IS_ALIVE
            .Byte(0) // size
            .Xor()
            .Build();
        this.serial.Send(frame);
    }
};
Driver = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Logger_1.Logger])
], Driver);
exports.Driver = Driver;
//# sourceMappingURL=Driver.js.map