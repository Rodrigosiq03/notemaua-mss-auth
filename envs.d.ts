declare namespace NodeJS {
  interface ProcessEnv {
    GITHUB_REF_NAME: string
    STAGE: string
    REGION: string
    STACK_NAME: string
    AWS_ACCOUNT_ID: string
    DYNAMO_TABLE_NAME: string
    DYNAMO_PARTITION_KEY: string
    DYNAMO_SORT_KEY: string
    ENDPOINT_URL: string
    S3_BUCKET_NAME: string
    JWT_SECRET: string
  }
}