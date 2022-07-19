import { Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Effect, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface TriggerTranscodingFunctionProps {
  bucket: IBucket;
}

export class TriggerTranscodingFunction extends Construct {

  constructor(scope: Construct, id: string, props: TriggerTranscodingFunctionProps) {
    super(scope, id);
    const mediaConvertRole = new Role(this, 'MediaConvertRole', {
      assumedBy: new ServicePrincipal('mediaconvert.amazonaws.com'),
    });

    props.bucket.grantRead(mediaConvertRole, 'uploads/*');
    props.bucket.grantWrite(mediaConvertRole, 'converted/*');

    const triggerFunction = new NodejsFunction(this, 'TriggerTranscodingFunction', {
      environment: {
        MEDIA_CONVERT_ROLE_ARN: mediaConvertRole.roleArn,
      },
    });
    triggerFunction.addToRolePolicy(new PolicyStatement({
      resources: ['arn:aws:mediaconvert:us-east-1:581514672367:endpoints/*'],
      actions: ['mediaconvert:DescribeEndpoints'],
      effect: Effect.ALLOW,

    }));

    triggerFunction.addToRolePolicy(new PolicyStatement({
      resources: ['arn:aws:mediaconvert:us-east-1:581514672367:queues/Default'],
      actions: ['mediaconvert:CreateJob'],
      effect: Effect.ALLOW,

    }));
    triggerFunction.addToRolePolicy(new PolicyStatement({
      resources: [mediaConvertRole.roleArn],
      actions: ['iam:PassRole'],
      effect: Effect.ALLOW,
    }));

    new Rule(this, 'SourceBucketTrigger', {
      targets: [new LambdaFunction(triggerFunction)],
      eventPattern: {
        source: ['aws.s3'],
        detailType: ['Object Created'],
        detail: {
          bucket: {
            name: [props.bucket.bucketName],
          },
          object: {
            key: [{ prefix: 'uploads/' }],
          },
        },
      },
    });
  }
}
