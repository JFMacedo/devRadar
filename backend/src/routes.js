const { Router } = require('express');
const devController = require('./controllers/devController');
const searchController = require('./controllers/searchController');

const routes = Router();

//Metodos HTTP: get, post, put e delete.

//Tipos de parâmetros:
//Query Params: request.query (Filtros, ordenação, paginação, ...)
//Route Params: request.params (Identifica um recurso na alteração ou remoção)
//Body: request.body (Dados para criação ou alteração de um registro)

//MongoDB (Não-relacional)

routes.get('/devs', devController.index);
routes.post('/devs', devController.store);
routes.get('/search', searchController.index);

module.exports = routes;