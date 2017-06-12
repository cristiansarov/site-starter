module.exports.connections = {

  developmentMysql: {
    adapter: 'sails-mysql',
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'site-starter',
    collation : 'utf8_general_ci'
  },

  productionMysql: {
    adapter: 'sails-mysql',
    host: 'localhost',
    user: 'root',
    password: '1qaz!QAZ',
    database: 'site-starter',
    collation : 'utf8_general_ci'
  }

};
