import {Construct, Stack, StackProps} from "@aws-cdk/core";
import {
    ApplicationListener,
    ApplicationLoadBalancer,
    ListenerAction,
} from "@aws-cdk/aws-elasticloadbalancingv2";
import {Vpc} from "@aws-cdk/aws-ec2";
import {StringParameter} from "@aws-cdk/aws-ssm";

interface LoadBalancerStackProps extends StackProps {
    readonly vpc: Vpc;
}

export class LoadBalancerMainStack extends Stack {
    readonly loadBalancer: ApplicationLoadBalancer;
    readonly httpListener: ApplicationListener;

    constructor(scope: Construct, id: string, props: LoadBalancerStackProps) {
        super(scope, id, props);

        this.loadBalancer = new ApplicationLoadBalancer(this, 'load-balancer-main', {
            vpc: props.vpc,
            internetFacing: true
        });

        this.httpListener = new ApplicationListener(this, 'load-balancer-main-http-listener', {
            loadBalancer: this.loadBalancer,
            port: 80,
            defaultAction: ListenerAction.fixedResponse(404, {
                messageBody: 'Not found.'
            })
        });

        new StringParameter(this, 'load-balancer-main-arn-parameter', {
            parameterName: 'nails-load-balancer-main-arn',
            stringValue: this.loadBalancer.loadBalancerArn
        });

        new StringParameter(this, 'load-balancer-main-http-listener-arn-parameter', {
            parameterName: 'nails-load-balancer-main-http-listener-arn',
            stringValue: this.httpListener.listenerArn
        });
    }
}