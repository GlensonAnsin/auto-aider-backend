import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgresDB connected.');
  } catch (e) {
    console.error('PostgresDB connection failed: ', e);
  }
};

export default connectPostgres;