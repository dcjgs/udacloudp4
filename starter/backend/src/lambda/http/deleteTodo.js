// TODO: Remove a TODO item by id
import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getUserId } from '../utils.mjs';
import { deleteTodoLogic } from '../../businessLogic/todos.mjs';

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId; // extract the id for todo item
    const userId = getUserId(event); // extract user id from even

    await deleteTodoLogic(userId, todoId); // delete logic for todo item

    return {
      statusCode: 202, // success
      headers: {
        'Access-Control-Allow-Origin': '*' // allow access from any source
      },
      body: JSON.stringify({}) // resp as json
    };
  });
