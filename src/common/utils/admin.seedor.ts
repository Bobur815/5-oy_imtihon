import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserRole } from '../types/user-role';

@Injectable()
export class AdminSeeder implements OnModuleInit {
    private readonly logger = new Logger(AdminSeeder.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) { }

    async onModuleInit() {
        const phone = this.configService.get<string>('ADMIN_PHONE') || '+998901662714';
        const password = this.configService.get<string>('ADMIN_PASSWORD') || '123456';
        const fullName = this.configService.get<string>('ADMIN_FULL_NAME') || 'Boburmirzo';

        const existingAdmin = await this.prisma.user.findFirst({
            where: { role: 'ADMIN'},
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(password!, 10);

            await this.prisma.user.create({
                data: {
                    phone: phone,
                    password: hashedPassword,
                    role: 'ADMIN',
                    fullName: fullName,
                },
            });

            this.logger.log('✅ Admin created');
        } else {
            this.logger.log('ℹ️ Admin already exists');
        }
    }
}
