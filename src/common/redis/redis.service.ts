import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClient;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.config.get<string>('REDIS_HOST', 'localhost'),
      port: this.config.get<number>('REDIS_PORT', 6379),
      retryStrategy(times: number) {
        return Math.min(times * 50, 2000);
      },
    });

    this.client.on('connect', () => this.logger.log('Redis connected'));
    this.client.on('ready',   () => this.logger.log('Redis ready'));
    this.client.on('error',   err => this.logger.error('Redis error', err));
    this.client.on('close',   ()  => this.logger.warn('Redis connection closed'));
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis client disconnected');
  }

  async set(key: string, value: string, ttlSeconds?: number){
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  getClient(): RedisClient {
    return this.client;
  }
}
