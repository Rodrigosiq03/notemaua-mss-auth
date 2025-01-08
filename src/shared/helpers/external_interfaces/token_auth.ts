import https from 'https';
import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserNotAuthenticated } from '../errors/controller_errors';

dotenv.config();

interface AzureProps {
    displayName: string;
    mail: string;
}


export class TokenAuth {
    secret: string;

    constructor() {
        this.secret = process.env.SECRET_KEY || "";
    }

    async generate_token(user_id: string): Promise<string> {
        return jwt.sign({ user_id }, this.secret, { expiresIn: '1d' });
    }

    async decode_token(token: string): Promise<string> {
        const decode_token = jwt.verify(token, this.secret) as JwtPayload;
        if (!decode_token.user_id) {
            throw new UserNotAuthenticated('Invalid or expired token.');
        }
        return decode_token.user_id;
    }

    async verify_azure_token(token: string): Promise<AzureProps> {
        const url = process.env.AZURE_URL || "";
        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        return await new Promise((resolve, reject) => {
            https.get(url, options, (res: any) => {
                let data = '';
                res.on('data', (chunk: any) => {
                    data += chunk;
                });
                res.on('end', () => {
                    let response: {
                        displayName: string;
                        mail: string;
                    } = JSON.parse(data);
                    if (!response["displayName"] || !response["mail"]) {
                        reject(new UserNotAuthenticated('Invalid or expired token.'));
                    }
                    resolve({
                        displayName: response["displayName"],
                        mail: response["mail"]
                    });
                });
            }).on("error", (err) => {
                reject(err);
            });
        });
    }
}