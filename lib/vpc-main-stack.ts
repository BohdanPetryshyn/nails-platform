import { SubnetType, Vpc } from '@aws-cdk/aws-ec2';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import * as ssm from '@aws-cdk/aws-ssm';

export class VpcMainStack extends Stack {
  readonly vpc: Vpc;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new Vpc(this, 'vpc-main', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'main-ecs-cluster',
          subnetType: SubnetType.PUBLIC,
        },
      ],
    });

    new ssm.StringParameter(this, 'vpc-main-id-parameter', {
      parameterName: 'nails-vpc-main-id',
      stringValue: this.vpc.vpcId,
    });
  }
}
