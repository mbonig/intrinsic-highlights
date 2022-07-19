import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { VideoEncoderStack } from '../src/VideoEncoderStack';

test('Snapshot', () => {
  const app = new App();
  const stack = new VideoEncoderStack(app, 'test');

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
