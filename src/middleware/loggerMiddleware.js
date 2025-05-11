const loggerMiddleware = store => next => action => {
  if (action.type?.includes('auth/')) {
    console.log('[AUTH ACTION]', action);
  }
  let result = next(action);
  return result;
};
export default loggerMiddleware;