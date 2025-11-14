/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient, PostStatus, Platform, Role } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: { email: 'demo@example.com', name: 'Demo User' },
  });

  // Workspaces
  const wsAcme = await prisma.workspace.upsert({
    where: { id: '00000000-0000-0000-0000-00000000acme' },
    update: {},
    create: { id: '00000000-0000-0000-0000-00000000acme', name: 'Acme', ownerId: user.id },
  });
  const wsGlobex = await prisma.workspace.upsert({
    where: { id: '00000000-0000-0000-0000-0000000globex' },
    update: {},
    create: { id: '00000000-0000-0000-0000-0000000globex', name: 'Globex', ownerId: user.id },
  });

  // Memberships
  await prisma.member.upsert({
    where: { userId_workspaceId: { userId: user.id, workspaceId: wsAcme.id } },
    update: { role: Role.OWNER },
    create: { userId: user.id, workspaceId: wsAcme.id, role: Role.OWNER },
  });
  await prisma.member.upsert({
    where: { userId_workspaceId: { userId: user.id, workspaceId: wsGlobex.id } },
    update: { role: Role.OWNER },
    create: { userId: user.id, workspaceId: wsGlobex.id, role: Role.OWNER },
  });

  // Channels for Acme
  const channels = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'X'];
  for (const name of channels) {
    await prisma.channel.upsert({
      where: { workspaceId_name: { workspaceId: wsAcme.id, name } },
      update: {},
      create: { workspaceId: wsAcme.id, name },
    });
  }

  // A few posts
  const now = new Date();
  const iso = (d) => d.toISOString();
  const dates = [
    iso(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0)),
    iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 14, 30, 0)),
    iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 12, 0, 0)),
  ];
  const statuses = [PostStatus.DRAFT, PostStatus.SCHEDULED, PostStatus.PUBLISHED];

  const acmeInsta = await prisma.channel.findFirst({ where: { workspaceId: wsAcme.id, name: 'Instagram' } });
  for (let i = 0; i < dates.length; i++) {
    await prisma.post.create({
      data: {
        workspaceId: wsAcme.id,
        channelId: acmeInsta?.id || null,
        title: `Seed Post ${i + 1}`,
        status: statuses[i],
        scheduledAt: dates[i],
        publishedAt: statuses[i] === PostStatus.PUBLISHED ? dates[i] : null,
        authorId: user.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

