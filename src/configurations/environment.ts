function getEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
  }

export const environment = new Proxy(
    {},
    {
      get: (_, key: string) => getEnv(key),
    }
  ) as Record<string, string>;