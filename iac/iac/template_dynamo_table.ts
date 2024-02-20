import { Construct } from 'constructs'
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb'
import { RemovalPolicy } from 'aws-cdk-lib'
import env from '../../index'

export class TemplateDynamoTable extends Construct {
  public table: Table

  constructor(scope: Construct, constructId: string) {
    super(scope, constructId)

    if (env.DYNAMO_TABLE_NAME === undefined) throw new Error('DYNAMO_TABLE_NAME is undefined')

    this.table = new Table(this, 'NotemauaMssAuthTable', {
      tableName: env.DYNAMO_TABLE_NAME,
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'SK',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    })
  }
}