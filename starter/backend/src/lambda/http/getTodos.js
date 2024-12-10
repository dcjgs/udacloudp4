// TODO: Get all TODO items for the current user

import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

import { getUserId } from '../utils.mjs';
import { getTodosLogic } from '../../businessLogic/todos.mjs';

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event); // get user id from event
    const todos = await getTodosLogic(userId); // get todos
    const response = { items: todos }; // create response with todo list
    return {
      statusCode: 200, // success
      body: JSON.stringify(response) // json fmt
    };
  });
