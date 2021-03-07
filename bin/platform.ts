#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PlatformStack } from '../lib/platform-stack';

const app = new cdk.App();
new PlatformStack(app, 'PlatformStack');
