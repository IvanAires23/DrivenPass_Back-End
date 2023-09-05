import { Injectable } from '@nestjs/common';
import Cryptr from 'cryptr'

@Injectable()
export class CryptrService {
    private readonly cryptr: Cryptr;
    private SALT = 10

    constructor() {
        this.cryptr = new Cryptr(process.env.PASSWORD_CRYPTR, {
            saltLength: this.SALT
        });
    }

    encrypt(data: string): string {
        return this.cryptr.encrypt(data);
    }

    decrypt(encryptedData: string): string {
        return this.cryptr.decrypt(encryptedData);
    }
}