/* eslint-disable @typescript-eslint/no-unused-vars */
import * as cdk from 'aws-cdk-lib'
import { TemplateStack } from './iac/template_stack'
import { adjustLayerDirectory } from './adjust_layer_directory'
import { envs as env } from '../index'

console.log('Starting the CDK')

console.log('Adjusting the layer directory')
adjustLayerDirectory()
console.log('Finished adjusting the layer directory')

const app = new cdk.App()

if (!env.REGION || !env.AWS_ACCOUNT_ID || !env.STACK_NAME) {
  throw new Error('Missing required environment variables. AQUIIIIII AQUIIIII AQUIIIII AQUUIIIIII AQUIIIIII');
}

const awsRegion = env.REGION;
const awsAccount = env.AWS_ACCOUNT_ID;
const stackName = env.STACK_NAME;


const tags = {
  'project': 'NotemauaMssAuth',
  'stage': 'DEV',
  'stack': 'BACK',
  'owner': 'DevDynasty'
}

new TemplateStack(app, stackName, {
  env: {
    region: awsRegion,
    account: awsAccount
  },
  tags: tags
})

app.synth()
