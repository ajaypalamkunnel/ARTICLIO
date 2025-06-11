import * as dotenv from 'dotenv'
import * as path from 'path';

const env = process.env.NODE_ENV || 'development';
const envFilePath = path.resolve(process.cwd(), `.env.${env}`)


dotenv.config({ path: envFilePath })


export const config = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGODB_URI || '',
    nodeEnv: process.env.NODE_ENV || 'development',
    accessSecret:process.env.ACCESS_TOKEN_SECRET as string,
    refreshSecret:process.env.REFRESH_TOKEN_SECRET as string,
    accessTokenExpiry:process.env.ACCESS_TOKEN_EXPIRY as string,
    refreshTokenExpiry:process.env.REFRESH_TOKEN_EXPIRY as string,
    smtp_host:process.env.SMTP_HOST as string,
    smtp_port:process.env.SMTP_PORT as string,
    smtp_user:process.env.SMTP_USER as string,
    smtp_pass:process.env.SMTP_PASS as string,

}

