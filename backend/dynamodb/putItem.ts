// putItem.ts
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

type PutItemArgs<T> = {
  client: DynamoDBDocumentClient;
  tableName: string;
  item: T;
};

export async function putItem<T>({ client, tableName, item }: PutItemArgs<T>): Promise<T> {
  // Optional: strip undefined values to avoid DynamoDB errors
  const sanitized = JSON.parse(JSON.stringify(item));

  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: sanitized
    })
  );

  return sanitized;
}
