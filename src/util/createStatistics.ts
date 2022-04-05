import { FastifyRequest } from 'fastify/types/request';
import { UAParser } from 'ua-parser-js';
import fetch from 'cross-fetch';

export const createStatistics = async (request: FastifyRequest) => {
  const ua = UAParser(request.headers['user-agent']);

  const data = {
    referer: request.headers.referer || 'direct',
    path: request.headers.path || '',
    ip: request.ip,
    browser: ua.browser.name || '',
    browserLang: request.headers['accept-language']?.split(',')[0] || '',
    os: ua.os.name || '',
    osVer: ua.os.version || '',
    device: ua.device.vendor || '',
    deviceModel: ua.device.model || '',
    deviceType: ua.device.type || '',
    countryCode: '',
    countryName: '',
  };

  try {
    const response = await fetch(`https://ip2c.org/${data.ip}`).then((res) =>
      res.text()
    );

    const [
      status,
      countryCodeTwoLetters,
      countryCodeThreeLetters,
      countryName,
    ] = response.split(';');

    if (status === '1') {
      data.countryCode = countryCodeTwoLetters;
      data.countryName = countryName;
    } else {
      data.countryCode = data.countryName = 'unknown';
    }
  } catch (error) {
    data.countryCode = data.countryName = 'unknown';
  }

  // TODO acccess linkID and then store to prisma

  // console.log(data);
};
