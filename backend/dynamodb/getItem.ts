// getItem.ts
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

type GetItemArgs = {
  client: DynamoDBDocumentClient;
  tableName: string;
  key: Record<string, any>;
};

export async function getItem<T>({ client, tableName, key }: GetItemArgs): Promise<T | null> {
  const result = await client.send(
    new GetCommand({
      TableName: tableName,
      Key: key
    })
  );

  return (result.Item as T) ?? null;
}
