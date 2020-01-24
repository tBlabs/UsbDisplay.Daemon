// These two imports must go first!
import 'reflect-metadata';
import { Types } from './Types';
import { Container } from 'inversify';

import { Main } from '../Main';
import { Driver } from '../Driver/Driver';
import * as express from 'express';
import { StartupArgs } from '../services/env/StartupArgs';
import { IStartupArgs } from '../services/env/IStartupArgs';
import { Config } from '../Config';
import { Logger } from '../services/logger/Logger';

const IoC = new Container();

try
{
    IoC.bind<Main>(Main).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<StartupArgs>(StartupArgs).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<Config>(Config).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<IStartupArgs>(Types.IStartupArgs).to(StartupArgs).inSingletonScope().whenTargetIsDefault();
    IoC.bind<Driver>(Driver).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<Logger>(Logger).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types.ExpressServer).toConstantValue(express()).whenTargetIsDefault();
}
catch (ex)
{
    console.log('IoC exception:', ex);
}

export { IoC };
