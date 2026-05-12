import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';
import * as readline from 'readline';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise(resolve => rl.question(question, resolve));
}

type AdminSeedInput = {
  fullName: string;
  username: string;
  phoneNumber: string;
  password: string;
};

async function getInteractiveAdminInput(): Promise<AdminSeedInput> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n=== SuperAdmin yaratish ===\n');

  const fullName = (await ask(rl, "To'liq ism: ")).trim();
  const username = (await ask(rl, 'Username: ')).trim();
  const phoneNumber = (await ask(rl, 'Telefon raqam: ')).trim();
  const password = (await ask(rl, 'Parol: ')).trim();

  rl.close();

  return { fullName, username, phoneNumber, password };
}

async function seedAdmin(adminInput: AdminSeedInput) {
  const { fullName, username, phoneNumber, password } = adminInput;
  if (!fullName || !username || !phoneNumber || !password) {
    console.error("Barcha maydonlar to'ldirilishi shart.");
    process.exit(1);
  }

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) {
    if (existing.deletedAt === null) {
      console.log(
        `\nAdmin allaqachon mavjud: ${existing.fullName} (@${existing.username}) [${existing.id}]`
      );
      return;
    }

    const restoredAdmin = await prisma.admin.update({
      where: { id: existing.id },
      data: {
        fullName,
        phoneNumber,
        passwordHash: bcrypt.hashSync(password, 12),
        role: 1, // SuperAdmin
        status: 1,
        deletedAt: null,
      },
    });

    console.log(
      `\nAdmin qayta tiklandi: ${restoredAdmin.fullName} (@${restoredAdmin.username}) [${restoredAdmin.id}]`
    );
    return;
  }

  const admin = await prisma.admin.create({
    data: {
      fullName,
      username,
      phoneNumber,
      passwordHash: bcrypt.hashSync(password, 12),
      role: 1, // SuperAdmin
      status: 1,
    },
  });

  console.log(`\nSuperAdmin yaratildi: ${admin.fullName} (@${admin.username}) [${admin.id}]`);
}

async function main() {
  const adminInput = await getInteractiveAdminInput();
  await seedAdmin(adminInput);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
