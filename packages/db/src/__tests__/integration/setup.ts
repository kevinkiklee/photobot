import { prisma } from '../../index';

const TEST_PREFIX = `test-${Date.now()}-`;

export function testId(suffix: string): string {
  return `${TEST_PREFIX}${suffix}`;
}

export async function cleanupTestData() {
  await prisma.configAuditLog.deleteMany({
    where: { serverId: { startsWith: TEST_PREFIX } },
  });
  await prisma.featureConfig.deleteMany({
    where: { serverId: { startsWith: TEST_PREFIX } },
  });
}

export async function connectDb() {
  await prisma.$connect();
}

export async function disconnectDb() {
  await cleanupTestData();
  await prisma.$disconnect();
}

export { prisma };
