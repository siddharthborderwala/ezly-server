import { FastifyRequest } from 'fastify';
import { UAParser } from 'ua-parser-js';

export const createStatistics = async (request: FastifyRequest) => {
  const ua = UAParser(request.headers['user-agent']);

  const data = {
    referer: request.headers.referer || 'direct',
    path: request.headers.path || '',
    // host: request.headers.host || '',
    // parmas: request.params,
    ip: request.ip,
    browser: ua.browser.name || '',
    os: ua.os.name || '',
    osVer: ua.os.version || '',
    device: ua.device.vendor || '',
    deviceModel: ua.device.model || '',
    deviceType: ua.device.type || '',
  };

  console.log(data);
};
