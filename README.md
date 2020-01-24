# UsbDisplay.Daemon

(Serial/USB) Driver and HTTP host (REST+Socket) for "UsbDisplay".  

## Install 

- `cd {dir}`
- `npm i`
- `sudo chmod +x run.sh`

## Start (production mode)

- `cd {dir}`
- modify `run.sh` (set `port`, `serial` and `log`)
- `./run.sh`

| Param     | Usage                                           |
| --------- | ----------------------------------------------- |
| port      | HTTP port for REST calls and socket connections |
| serial    | USB or UART "BluePill" is connected to          |
| log       | Let it talk                                     |

## Development

`npm run serve`  
You can change startup params in `autorun` script (in `package.json` > `scripts` section). Remember to always restart `serve` tool after any changes in `package.json`.

## Stop

`Ctrl+C`

# Client API

There are two options to "talk" to BluePill. Via HTTP (REST API) or TCP (Socket).

## HTTP

| Action       | Method  | Url             | Example request | Example response | Side effects     |
| ------------ | ------- | --------------- | --------------- | ---------------- | ---------------- |
| Set value    | GET     | /set/`value`    | /set/123        | *HTTP 200 OK*    | none             |

## SOCKET


TODO::::::::::::::::::::::::::::::::::
### Client --> Host

| Action       | Event  | Args                    | Example                      | Side effects               |
| ------------ | ------ | ----------------------- | ---------------------------- | -------------------------- |
| Get IO value | `get`  | addr (address of IO)    | socket.emit('get',  4)       | *none*                     |
| Set IO value | `set`  | addr|  value (new value) | socket.emit('set', 4, 123)  | `update` to every client   |

### Host --> Client

| Event           | Args          |
| --------------- | ------------- |
| `update`        |  addr, value  |
| `driver-error`  |  addr, value  |

# Signals  
  
## SIGINT  
  
Press `Ctrl+C` to kill server and driver.

# Testing on PC

- Connect "BluePill" board to USB (via FTDI converter or something)
- Run `run.sh` script (check it's args first)
- Open browser and hit `http://localhost:3000/12/0` to turn build in led on. Hit `http://localhost:3000/12/1` to turn it off.  
At `http://localhost:3000/11` RTC value can be found. Refresh page few times to see if it's growing.