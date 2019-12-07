const axios = require("axios");

class APIHandler {
    constructor (baseUrl) {
      this.BASE_URL = baseUrl;
    }
    getFullList () {
      return axios.get(this.BASE_URL + '/recipes');
    }
  }

  module.exports = APIHandler;