import dotenv from 'dotenv'
dotenv.config()

declare var process: {
    env: {
        MYSQL_HOST: string,
        MYSQL_USER: string,
        MYSQL_PASSWORD: string,
        MYSQL_PORT: number,
        MYSQL_DB: string,
    }
}

export default {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0

}

