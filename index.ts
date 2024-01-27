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
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  MSS_NAME: process.env.MSS_NAME,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  CLOUD_FRONT_DISTRIBUTION_DOMAIN: process.env.CLOUD_FRONT_DISTRIBUTION_DOMAIN,
  JWT_SECRET: process.env.JWT_SECRET,
  FIRST_ACCESS_PASSWORD: process.env.FIRST_ACCESS_PASSWORD,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD
}

export default envs