export const isLocal = (): boolean => process.env.NODE_ENV === 'local' || process.env.NODE_ENV == 'development';
