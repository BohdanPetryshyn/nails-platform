#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VpcMainStack } from '../lib/vpc-main-stack';
import { EcsClusterMainStack } from '../lib/ecs-cluster-main-stack';
import { LoadBalancerMainStack } from '../lib/load-balancer-main-stack';

const app = new cdk.App();

const vpcStack = new VpcMainStack(app, 'vpc-main-stack');

const loadBalancerStack = new LoadBalancerMainStack(
  app,
  "load-balancer-stack",
  {
    vpc: vpcStack.vpc,
  },
);

const ecsClusterStack = new EcsClusterMainStack(app, "ecs-cluster-stack", {
  vpc: vpcStack.vpc,
  loadBalancer: loadBalancerStack.loadBalancer,
});
