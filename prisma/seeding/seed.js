const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function seedUsers() {
        const users = [
            {
                firstname: 'Admin',
                lastname: 'Adminsson',
                username: 'admin',
                email: 'admin@admin.com',
                password: 'admin',
                role: 'ADMIN',
            },
            {
                firstname: 'User',
                lastname: 'Usersson',
                username: "user",
                email: 'user@user.com',
                password: 'user',
            },
            {
                firstname: 'Guest',
                lastname: 'Guestsson',
                username: "guest",
                email: 'guest@guest.com',
                password: 'guest',
            },
            {
                firstname: 'Test',
                lastname: 'Testsson',
                username: "test",
                email: 'test@test.com',
                password: 'test',
                role: 'USER',
            },
            {
                firstname: 'Moderator',
                lastname: 'Moderatorsson',
                username: "mod",
                email: 'mod@mod.com',
                password: 'mod',
                role: 'MOD',
            },
        ];

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const password = await bcrypt.hash(user.password, 12);
            user.password = password;
            await prisma.user.create({
                data: user,
            });
        }
}

async function main() {
    await seedUsers();
    
    prisma.$disconnect();
}

main().catch(e => {
    console.log('Seeding failed:');
    console.error(e);
    process.exit(1);
}).finally(() => {
    console.log('Done seeding!');
    prisma.$disconnect()
});