// deleteItem.ts
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

type DeleteItemArgs = {
  client: DynamoDBDocumentClient;
  tableName: string;
  key: Record<string, any>;
};

export async function deleteItem({
  client,
  tableName,
  key
}: DeleteItemArgs): Promise<void> {
  await client.send(
    new DeleteCommand({
      TableName: tableName,
      Key: key
    })
  );
}
