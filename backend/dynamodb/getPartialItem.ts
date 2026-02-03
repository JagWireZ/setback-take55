// getPartialItem.ts
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

type GetPartialItemArgs = {
  client: DynamoDBDocumentClient;
  tableName: string;
  key: Record<string, any>;
  attribute: string; // the single attribute to fetch
};

export async function getPartialItem<T>({
  client,
  tableName,
  key,
  attribute
}: GetPartialItemArgs): Promise<T | null> {
  // Use a placeholder to avoid reserved word issues
  const ExpressionAttributeNames = {
    "#attr": attribute
  };

  const result = await client.send(
    new GetCommand({
      TableName: tableName,
      Key: key,
      ProjectionExpression: "#attr",
      ExpressionAttributeNames
    })
  );

  if (!result.Item) {
    return null;
  }

  return result.Item[attribute] as T;
}
