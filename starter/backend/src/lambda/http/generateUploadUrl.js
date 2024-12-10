// TODO: Return a presigned URL to upload a file for a TODO item with the provided id
import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { createLogger } from '../../utils/logger.mjs';
import { getUserId } from '../utils.mjs';
import { saveImgUrl } from '../../dataLayer/todosAccess.mjs';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucketName = process.env.S3_BUCKET; // the env var has the bucket name
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION); // exp time for url
const logger = createLogger('generateUploadUrl'); // logger for upload url
const client = new S3Client({ region: "us-east-1" }); // s3 at region

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId; // id of todo item from path param

    logger.info('Generating upload URL:', {
      todoId,
      bucketName
    });
    const userId = getUserId(event); // user id from evt

    const command = new PutObjectCommand({ Bucket: bucketName, Key: todoId }); // create a command
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: urlExpiration });  

    logger.info('Generated upload URL:', {
      todoId,
      uploadUrl
    });

    await saveImgUrl(userId, todoId, bucketName); // save img url to db

    return {
      statusCode: 200, // success
      headers: {
        'Access-Control-Allow-Origin': '*' // allow access from any src
      },
      body: JSON.stringify({
        uploadUrl: uploadUrl // signed url
    };
  });
