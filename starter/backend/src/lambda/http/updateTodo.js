// TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getUserId } from '../utils.mjs';
import { updateTodoLogic } from '../../businessLogic/todos.mjs';

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId; // todo id from path param
    const updatedTodo = JSON.parse(event.body); // parse the obj from evt/req
    const userId = getUserId(event); // get usr id from evt
    await updateTodoLogic(userId, todoId, updatedTodo); // update the todo logic with updtd info
    return {
      statusCode: 200, // success
      headers: {
        'Access-Control-Allow-Origin': '*' // allow from any src
      },
      body: JSON.stringify(updatedTodo) // json fmt
    };
  });
