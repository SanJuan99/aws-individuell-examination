"use strict";
// backend/handler.js
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// POST - skapa nytt meddelande

export const createMessage = async (event) => {
    try {
        const body = JSON.parse(event.body);

        if (!body.username || !body.text) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
                body: JSON.stringify({ error: "Username and text are required" }),
            };
        }

        const newMessage = {
            id: uuidv4(),
            username: body.username,
            text: body.text,
            createdAt: new Date().toISOString(),
        };

        await dynamoDb
            .put({
                TableName: process.env.DYNAMODB_TABLE,
                Item: newMessage,
            })
            .promise();

        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify(newMessage),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};

// GET - hämta alla meddelanden

export const getMessages = async (event) => {
    try {
        const username = event.queryStringParameters?.username;

        let result;

        if (username) {
            // hämta alla meddelanden för en specifik användare
            result = await dynamoDb
                .scan({
                    TableName: process.env.DYNAMODB_TABLE,
                    FilterExpression: "username = :u",
                    ExpressionAttributeValues: {
                        ":u": username,
                    },
                })
                .promise();
        } else {
            // hämta alla meddelanden
            result = await dynamoDb
                .scan({
                    TableName: process.env.DYNAMODB_TABLE,
                })
                .promise();
        }

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};

// PUT - uppdatera ett meddelande

export const updateMessage = async (event) => {
    try {
        const { id } = event.pathParameters;
        const body = JSON.parse(event.body);

        if (!body.text) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
                body: JSON.stringify({ error: "Text is required" }),
            };
        }

        // Kontrollera om meddelandet finns
        const result = await dynamoDb
            .get({
                TableName: process.env.DYNAMODB_TABLE,
                Key: { id },
            })
            .promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
                body: JSON.stringify({ error: "Message not found" }),
            };
        }

        // uppdaterar textfältet och returnerar det uppdaterade objektet
        const updated = await dynamoDb
            .update({
                TableName: process.env.DYNAMODB_TABLE,
                Key: { id },
                UpdateExpression: "set #t = :text",
                ExpressionAttributeNames: { "#t": "text" },
                ExpressionAttributeValues: { ":text": body.text },
                ReturnValues: "ALL_NEW",
            })
            .promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify(updated.Attributes), // skickar tillbaka det nya objektet
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};

// OPTIONS - CORS preflight

export const optionsHandler = async () => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ message: "CORS preflight OK" }),
    };
};