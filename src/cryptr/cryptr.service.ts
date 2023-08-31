import { Injectable } from '@nestjs/common';
import Cryptr from 'cryptr'

@Injectable()
export class CryptrService {
    private readonly cryptr: Cryptr;

    constructor() {
        this.cryptr = new Cryptr('chave-secreta-aqui');
    }

    encrypt(data: string): string {
        return this.cryptr.encrypt(data);
    }

    decrypt(encryptedData: string): string {
        return this.cryptr.decrypt(encryptedData);
    }
}