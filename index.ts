import { config } from 'dotenv'
import path from 'path'

// const stage = process.env.STAGE

// if (stage === 'DEV') config({ path: path.resolve(__dirname, './.env.local') })
config({ path: path.resolve(__dirname, './.env') })

const envs = {
  STAGE: process.env.STAGE,
  GITHUB_REF: process.env.GITHUB_REF_NAME,
  REGION: process.env.REGION,
  STACK_NAME: process.env.STACK_NAME,
  AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID,
  DYNAMO_TABLE_NAME: process.env.DYNAMO_TABLE_NAME,
  DYNAMO_PARTITION_KEY: process.env.DYNAMO_PARTITION_KEY,
  DYNAMO_SORT_KEY: process.env.DYNAMO_SORT_KEY,
  ENDPOINT_URL: process.env.ENDPOINT_URL,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  SECRET_KEY: process.env.SECRET_KEY,
  AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
  AZURE_URL: process.env.AZURE_URL,
}
console.log(envs)

export { envs }