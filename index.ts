import { config } from 'dotenv'
config()

const envs = {
  STAGE: process.env.STAGE,
  REGION: process.env.REGION,
  STACK_NAME: process.env.STACK_NAME,
  AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID,
  DYNAMO_TABLE_NAME: process.env.DYNAMO_TABLE_NAME,
  DYNAMO_PARTITION_KEY: process.env.DYNAMO_PARTITION_KEY,
  DYNAMO_SORT_KEY: process.env.DYNAMO_SORT_KEY,
  ENDPOINT_URL: process.env.ENDPOINT_URL,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
}

export default envs