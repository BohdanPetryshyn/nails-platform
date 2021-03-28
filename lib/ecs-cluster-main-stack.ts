import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { Cluster } from '@aws-cdk/aws-ecs';
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Port,
  Vpc,
} from '@aws-cdk/aws-ec2';
import { StringParameter } from '@aws-cdk/aws-ssm';
import { ApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';

interface EcsClusterStackProps extends StackProps {
  readonly vpc: Vpc;
  readonly loadBalancer: ApplicationLoadBalancer;
}

export class EcsClusterMainStack extends Stack {
  readonly cluster: Cluster;

  constructor(scope: Construct, id: string, props: EcsClusterStackProps) {
    super(scope, id, props);

    this.cluster = new Cluster(this, 'ecs-cluster-main', {
      clusterName: 'nails-ecs-cluster-main',
      vpc: props.vpc,
    });

    this.cluster.connections.allowFrom(
      props.loadBalancer,
      Port.allTcp(),
      'Allow load balancer to connect to services in cluster.',
    );

    this.cluster.addCapacity('ecs-cluster-main-ec2-capacity', {
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      desiredCapacity: 1,
    });

    new StringParameter(this, 'ecs-cluster-main-name-parameter', {
      parameterName: 'nails-ecs-cluster-main-name',
      stringValue: this.cluster.clusterName,
    });
  }
}
