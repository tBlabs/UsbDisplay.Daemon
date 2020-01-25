import 'reflect-metadata';
import { FluentBuilder } from '../utils/FluentBuilder/FluentBuilder';
import { injectable } from 'inversify';
import { Serial } from './Serial';
import { Logger } from '../services/logger/Logger';

@injectable()
export class Driver
{
    constructor(private _log: Logger)
    { }

    private serial: Serial = new Serial();

    public async Disconnect(): Promise<void>
    {
        await this.serial.Disconnect();
    }

    public Connect(port: string, onConnectionCallback?: () => void): void
    {
        this.serial.OnConnection(() =>
        {
            if (onConnectionCallback)
                onConnectionCallback();
        });

        this.serial.OnData((data) =>
        {
            this._log.Log('Response from serial: ' + JSON.stringify(data));
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

    public Set(value: number, animation: number, rotation: number): void
    {
        const frame = (new FluentBuilder())
            .Byte(6) // VALUE_SET
            .Byte(4) // size
            .Word2LE(value)
            .Byte(animation)
            .Byte(rotation)
            .Xor()
            .Build();

        this.serial.Send(frame);
    }

    public KeepAlive(): void
    {
        const frame = (new FluentBuilder())
            .Byte(5) // IS_ALIVE
            .Byte(0) // size
            .Xor()
            .Build();

        this.serial.Send(frame);
    }
}
