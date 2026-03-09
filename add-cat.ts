import { PrismaClient } from './packages/database/generated/client/index.js';
const prisma = new PrismaClient();

async function main() {
    const cat = await prisma.category.upsert({
        where: { slug: 'plastic-utensils' },
        update: {},
        create: {
            nameAr: 'الأواني البلاستيكية',
            nameEn: 'Plastic Utensils',
            slug: 'plastic-utensils',
            sortOrder: 5,
            isActive: true
        }
    });
    console.log('Successfully added categor:', cat);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
