// import { generateKeyPairSync } from 'crypto';
// import { join } from 'path';
// import { writeFileSync } from 'fs';
// import { passphrase } from './config';
//
// const { publicKey, privateKey } = generateKeyPairSync('rsa', {
//     modulusLength: 4096,
//     publicKeyEncoding: {
//         type: 'spki',
//         format: 'pem'
//     },
//     privateKeyEncoding: {
//         type: 'pkcs8',
//         format: 'pem',
//         cipher: 'aes-256-cbc',
//         passphrase
//     }
// });
// writeFileSync(join('keys', '.private.key'), privateKey);
// writeFileSync(join('keys', '.public.key.pem'), publicKey);