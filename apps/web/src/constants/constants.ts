export const STORAGE_IDENTITY_KEY = 'identity';
export const CACHE_TXS_KEY = 'cache_txs';
export const CACHE_BACKUP_KEY = 'backup';
export const LAWALLET_VERSION = 'v0.6';

export const MAX_INVOICE_AMOUNT = 10 ** 7;

export const regexUserName: RegExp = /^[A-Za-z0123456789]+$/;
export const regexComment: RegExp = /^[.,()[\]_\-a-zA-Z0-9'"¡!¿?:;\s]+$/;
export const regexURL = /^(http|https):\/\/[^ "]+$/;

export const lightningAddresses = [
  'lawallet.ar',
  'hodl.ar',
  'walletofsatoshi.com',
  'getalby.com',
  'blink.com',
  'bitrefill.com',
  'btcpp.ar',
];
