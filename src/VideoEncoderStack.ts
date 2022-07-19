import { Stack, StackProps } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { TriggerTranscodingFunction } from './constructs/TriggerTranscoding/TriggerTranscodingFunction';
import { VideoTranscodingStackTest } from './constructs/VideoTranscodingStackText/VideoTranscodingStackTest';

export class VideoEncoderStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const mediaBucket = new Bucket(this, 'MediaBucket', {
      blockPublicAccess: {
        blockPublicAcls: true,
        ignorePublicAcls: true,
        blockPublicPolicy: true,
        restrictPublicBuckets: true,
      },
      eventBridgeEnabled: true,
    });
    new TriggerTranscodingFunction(this, 'TranscodingTrigger', {
      bucket: mediaBucket,
    });

    new VideoTranscodingStackTest(this, 'Tester', {
      bucket: mediaBucket,
    });

  }
}
