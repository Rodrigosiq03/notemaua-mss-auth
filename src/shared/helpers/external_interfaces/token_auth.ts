import https from 'https';
import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserNotAuthenticated } from '../errors/controller_errors';
import querystring from 'querystring';

dotenv.config();

interface AzureProps {
    displayName: string;
    mail: string;
}

export class TokenAuth {
    secret: string;
    tenant_id: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;

    constructor() {
        this.secret = process.env.SECRET_KEY || "";
        this.tenant_id = process.env.AZURE_TENANT_ID || "";
        this.client_id = process.env.AZURE_CLIENT_ID || "";
        this.client_secret = process.env.AZURE_CLIENT_SECRET || "";
        this.redirect_uri = process.env.AZURE_REDIRECT_URI || "";
    }

    async generate_token(user_id: string): Promise<string> {
        return jwt.sign({ user_id }, this.secret);
    }

    async decode_token(token: string): Promise<string> {
        const decode_token = jwt.verify(token, this.secret) as JwtPayload;
        if (!decode_token.user_id) {
            throw new UserNotAuthenticated('Invalid or expired token.');
        }
        return decode_token.user_id;
    }

    async get_access_token(code: string): Promise<string> {
        const token_endpoint = `https://login.microsoftonline.com/${this.tenant_id}/oauth2/v2.0/token`;

        const body = querystring.stringify({
            client_id: this.client_id,
            scope: "User.Read",
            code: code,
            redirect_uri: this.redirect_uri,
            grant_type: "authorization_code",
            client_secret: this.client_secret
        });

        return new Promise((resolve, reject) => {
            const req = https.request(token_endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(body)
                }
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    const parsedData = JSON.parse(data);
                    if (parsedData.error) {
                        reject(new UserNotAuthenticated(parsedData.error_description));
                    } else {
                        resolve(parsedData.access_token);
                    }
                });
            });
            req.on('error', reject);
            req.write(body);
            req.end();
        });
    }

    async verify_azure_token(token: string): Promise<AzureProps> {
        const url = "https://graph.microsoft.com/v1.0/me";
        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        return await new Promise((resolve, reject) => {
            https.get(url, options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    const response = JSON.parse(data);
                    if (!response.displayName || !response.mail) {
                        reject(new UserNotAuthenticated('Invalid or expired token.'));
                    }
                    resolve({
                        displayName: response.displayName,
                        mail: response.mail
                    });
                });
            }).on("error", (err) => reject(err));
        });
    }
}
