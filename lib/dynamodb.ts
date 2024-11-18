import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION
});

// Create an abstract layer to handle the marshall/unmarshall automatically
export const dynamoDb = DynamoDBDocumentClient.from(client);

export const putItem = async (tableName: string, item: any) => {
  const params = {
    TableName: tableName,
    Item: item,
  };
  return dynamoDb.send(new PutCommand(params));
};

export const getItem = async (tableName: string, clerkUserId: string) => {
  const params = {
    TableName: tableName,
    Key: { clerkUserId },
  };
  const response = await dynamoDb.send(new GetCommand(params));
  return response.Item;
};