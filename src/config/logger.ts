import chalk from 'chalk';
import type { Request, Response } from 'express';
import morgan from 'morgan';

chalk.level = 2;
const start: string = chalk.green(`${'='.repeat(127)}\n`);
const end: string = chalk.green(`${'='.repeat(127)}\n`);

morgan.token('httpStatus', (_req: Request, res: Response) => {
  let statusCode: string;

  if (res.statusCode === 500) {
    statusCode = chalk.red.bold(res.statusCode.toString());
  } else if (res.statusCode >= 400) {
    statusCode = chalk.yellow.bold(res.statusCode.toString());
  } else {
    statusCode = chalk.green.bold(res.statusCode.toString());
  }

  return statusCode;
});

morgan.token('httpRequest', (req: Request) => {
  const { method, httpVersion, protocol, originalUrl } = req;
  const string: string = `${method} ${originalUrl} ${protocol.toUpperCase()}/${httpVersion}`;
  let httpRequest: string = method;

  if (method === 'GET') {
    httpRequest = chalk.green.bold(string);
  } else if (method === 'POST') {
    httpRequest = chalk.yellow.bold(string);
  } else if (method === 'PUT') {
    httpRequest = chalk.blue.bold(string);
  } else if (method === 'PATCH') {
    httpRequest = chalk.magenta.bold(string);
  } else if (method === 'DELETE') {
    httpRequest = chalk.red.bold(string);
  }

  return httpRequest;
});

morgan.token('requestBody', (req: Request) =>
  chalk.white.bold(
    `
HEADERS => ${JSON.stringify(req.headers, null, 2)}
${chalk.bold('<<<')} PARAMS => ${JSON.stringify(req.params ?? {})}
${chalk.bold('<<<')} QUERY => ${JSON.stringify(req.query ?? {})}
${chalk.bold('<<<')} BODY => ${JSON.stringify(req.body ?? {}, null, 2)}`
  )
);

morgan.token('responseBody', (req: Request) => {
  const { response } = req;

  if (response?.success) {
    const responseString: string = JSON.stringify(response);
    return chalk.green.bold(
      `RESPONSE => ${responseString.length > 2500 ? 'Response is too long' : responseString}`
    );
  }

  return chalk.red.bold(`ERROR => ${JSON.stringify(response)}`);
});

export default () =>
  morgan(
    `${start}${chalk.bold('<<<')} :httpRequest :remote-addr :user-agent\n${chalk.bold(
      '<<<'
    )} :requestBody\n\n${chalk.bold(
      '>>>'
    )} :httpStatus :res[content-length] :response-time[0]ms :total-time[0]ms\n${chalk.bold(
      '>>>'
    )} :responseBody\n${end}`
  );
