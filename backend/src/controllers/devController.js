const axios = require('axios');
const dev = require('../models/dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

//Funções do controller: index, store, update e destroy.

module.exports = {
  async index(request, response) {
    const devs = await dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let Dev = await dev.findOne({ github_username });
      if (!Dev) {
        const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

        const { name = login, avatar_url, bio } = apiResponse.data;

        const techsArray = parseStringAsArray(techs);

        const location = {
          type: 'Point',
          coordinates: [longitude, latitude],
        };

        Dev = await dev.create({
          github_username,
          name,
          avatar_url,
          bio,
          techs: techsArray,
          location,
        })

        //Filtrar conexões que estão há no maximo 10km de distância e que o novo
        //dev tenha pelo menos uma das tecnologias filtradas
        const sendSocketMessageTo = findConnections(
          { latitude, longitude },
          techsArray,
        )
        sendMessage(sendSocketMessageTo, 'newDev', dev);
      }

    return response.json(Dev);
  },
};