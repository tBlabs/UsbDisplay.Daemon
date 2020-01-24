"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const FluentBuilder_1 = require("../utils/FluentBuilder/FluentBuilder");
const inversify_1 = require("inversify");
const Serial_1 = require("./Serial");
let Driver = class Driver {
    constructor() {
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
            console.log('FROM SERIAL:', data);
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
    Set(value) {
        const animation = 0;
        const rotation = 0;
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
};
Driver = __decorate([
    inversify_1.injectable()
], Driver);
exports.Driver = Driver;
//# sourceMappingURL=Driver.js.map