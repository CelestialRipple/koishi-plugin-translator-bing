"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const koishi = require("koishi");
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const translator_1 = __importDefault(require("@koishijs/translator"));
class bingTranslator extends translator_1.default {
  async translate(options) {
    const { bing_secret, bing_region } = this.config;
    let endpoint = "https://api.cognitive.microsofttranslator.com";
    const response = await axios({
      baseURL: endpoint,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': bing_secret,
        'Content-type': 'application/json',
        'Ocp-Apim-Subscription-Region': bing_region,
        'X-ClientTraceId': uuidv4().toString()
      },
      params: {
        'api-version': '3.0',
        'from': options.source || 'zh-CN',
        'to': options.target || 'en'
      },
      data: [{
        'text': options.input
      }],
      responseType: 'json'
    });

    return response.data[0].translations[0].text;
  }
}

bingTranslator.Config = koishi.Schema.object({
  bing_secret: koishi.Schema.string().role('secret').required().description('bing翻译的api secret，请访问https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation申请'),
  bing_region: koishi.Schema.string().required().description('bing翻译的api所在地区，例：southeastasia')
});

module.exports = bingTranslator;