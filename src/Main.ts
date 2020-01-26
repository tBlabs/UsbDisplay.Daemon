import 'reflect-metadata';
import { injectable } from 'inversify';
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

        server.all('/', (req, res) =>
        {
            res.send('Welcom to USB Display');
        });

        server.all('/set/:value/:animation/:rotation', (req, res) =>
        {
            const value = parseInt(req.params.value, 10);
            const animation = parseInt(req.params.animation, 10);
            const rotation = parseInt(req.params.rotation, 10);

            this._logger.Log(`HTTP | SET VALUE TO ${value}`);

            this._driver.Set(value, animation, rotation);

            res.sendStatus(202);
        });

        server.all('/KeepAlive', (req, res) =>
        {
            this._logger.Log(`HTTP | KEEP ALIVE`);

            this._driver.KeepAlive();

            res.sendStatus(202);
        });

        server.use((err, req, res, next) =>
        {
            this._logger.Log(`Globally caught server error: ${err.message}`);

            res.send(err.message);
        });


        socket.on('error', (e) => this._logger.Log(`SOCKET ERROR ${e}`));

        socket.on('connection', (socket: Socket) =>
        {
            clients.Add(socket);

            socket.on('set', (value, animation, rotation) =>
            {
                try
                {
                    this._logger.Log(`SOCKET | SET VALUE TO ${value}`);

                    this._driver.Set(value, animation, rotation);
                }
                catch (error)
                {
                    this._logger.Log(`DRIVER ERROR ${error.message}`);

                    socket.emit('driver-error', error.message);
                }
            });
        });

        const port = this._config.Port;
        const serial = this._config.Serial;

        httpServer.listen(port, () => this._logger.LogAlways(`SERVER STARTED @ ${port}`));
        this._driver.Connect(serial, () => this._logger.LogAlways(`BOARD CONNECTED @ ${serial}`));

        const keepAliveTimer = setInterval(() =>
        {
            this._logger.Log('Sending keep alive...');
            this._driver.KeepAlive();
        }, 3000);

        const Dispose = async () =>
        {
            clearInterval(keepAliveTimer);

            clients.DisconnectAll();

            await this._driver.Disconnect();
            this._logger.LogAlways(`BOARD DISCONNECTED @ ${serial}`);

            httpServer.close(() => this._logger.LogAlways(`SERVER CLOSED @ ${port}`));
        }

        process.on('SIGINT', async () =>
        {
            await Dispose();
        });
        
        server.all(['/die', '/exit', '/kill', '/detach', '/dispose'], async (req, res) =>
        {
            await Dispose();

            res.sendStatus(202);
        });
    }
}
