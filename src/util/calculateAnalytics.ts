export const calcAnalytics = (analyticsData: any[]) => {
  const calcResults: { [k: string]: any } = {};

  const addFreq = (a: string, b: string) => {
    if (!calcResults[a]) {
      calcResults[a] = {};
    }
    if (calcResults[a][b]) {
      calcResults[a][b]++;
    } else {
      calcResults[a][b] = 1;
    }
  };

  analyticsData.forEach((item: any) => {
    const country = item.countryCode || 'other';
    const referer = item.referer || 'other';
    const device = item.device || 'other';
    const os = item.os || 'other';
    const browser = item.browser || 'other';
    const language = item.browserLang || 'other';

    addFreq('countries', country);
    addFreq('referers', referer);
    addFreq('devices', device);
    addFreq('operatingSystems', os);
    addFreq('browsers', browser);
    addFreq('languages', language);
  });

  const analytics = {
    countries: Object.entries(calcResults.countries).map((item) => {
      return {
        id: item[0],
        value: item[1],
      };
    }),
    referers: Object.entries(calcResults.referers).map((item) => {
      return {
        id: item[0],
        label: item[0],
        value: item[1],
      };
    }),
    devices: Object.entries(calcResults.devices).map((item) => {
      return {
        id: item[0],
        label: item[0],
        value: item[1],
      };
    }),
    operatingSystems: Object.entries(calcResults.operatingSystems).map(
      (item) => {
        return {
          id: item[0],
          label: item[0],
          value: item[1],
        };
      }
    ),
    browsers: Object.entries(calcResults.browsers).map((item) => {
      return {
        id: item[0],
        label: item[0],
        value: item[1],
      };
    }),
    languages: Object.entries(calcResults.languages).map((item) => {
      return {
        id: item[0],
        label: item[0],
        value: item[1],
      };
    }),
  };
  return analytics;
};
