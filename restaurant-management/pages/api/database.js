import mysql from 'mysql2/promise';

export async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: 'qtt.ddns.net',
    user: 'chefflow',
    password: '123123',
    database: 'chefflow',
  });

  return connection;
}
