import 'reflect-metadata';
import { injectable } from 'inversify';
import { IoState } from './Driver/IoState';
import { Driver } from './Driver/Driver';
import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import { Socket } from 'socket.io';
import { Clients } from './Clients';
import { Config } from './Config';
import { Logger } from './services/logger/Logger';

@injectable()
export class Main
{
    constructor(
        private _config: Config,
        private _driver: Driver,
        private _logger: Logger)
    { }

    public async Run(): Promise<void>
    {
        const server = express();
        const httpServer = http.createServer(server);
        const socket = socketIo(httpServer);
        const clients = new Clients();

        server.get('/favicon.ico', (req, res) => res.status(204));

        server.all('/ping', (req, res) =>
        {
            this._logger.Log('PING');
            
            res.send('pong');
        });

        server.all('/set/:value', (req, res) =>
        {
            const value = parseInt(req.params.value, 10);

            this._logger.Log(`HTTP | SET VALUE TO ${ value }`);

            this._driver.Set(value);

            res.sendStatus(202);
        });

        server.use((err, req, res, next) =>
        {
            this._logger.Log(`Globally caught server error: ${ err.message }`);

            res.send(err.message);
        });


        socket.on('error', (e) => this._logger.Log(`SOCKET ERROR ${ e }`));

        socket.on('connection', (socket: Socket) =>
        {
            clients.Add(socket);

            socket.on('set', (value) =>
            {
                try
                {
                    this._logger.Log(`SOCKET | SET VALUE TO ${ value }`);

                    this._driver.Set(value);
                }
                catch (error)
                {
                    this._logger.Log(`DRIVER ERROR ${ error.message }`);

                    socket.emit('driver-error', error.message);
                }
            });
        });

        const port = this._config.Port;
        const serial = this._config.Serial;

        httpServer.listen(port, () => this._logger.LogAlways(`SERVER STARTED @ ${ port }`));
        this._driver.Connect(serial, () => this._logger.LogAlways(`BOARD CONNECTED @ ${ serial }`));


        process.on('SIGINT', async () =>
        {
            clients.DisconnectAll();

            await this._driver.Disconnect();
            this._logger.LogAlways(`BOARD DISCONNECTED`);

            httpServer.close(() => this._logger.LogAlways(`SERVER CLOSED`));
        });
    }
}
