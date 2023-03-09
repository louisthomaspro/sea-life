import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';

function withNextCors(
  handler: NextApiHandler,
): NextApiHandler {
  return async function nextApiHandlerWrappedWithNextCors(req, res) {
    const methods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];
    const allowedOrigins = 'https://sea-life.vercel.app';
    await NextCors(req, res, {
      methods,
      origin: allowedOrigins,
    });

    return handler(req, res);
  };
}

export default withNextCors;