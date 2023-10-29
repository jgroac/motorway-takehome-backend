import knex from 'knex';
import dbConfig from '../config/database';

const database = knex(dbConfig);

export default database;
