const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.30.0',
  defaultReleaseBranch: 'main',
  name: 'intrinsic-highlights',

  deps: [
    '@wheatstalk/cdk-intrinsic-validator@0.2.8',
    '@matthewbonig/state-machine',
    'eslint',
  ],
});
project.synth();
