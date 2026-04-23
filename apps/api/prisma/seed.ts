import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { MOCK_YOUTUBE_DATA } from '../src/modules/videos/infrastructure/adapters/mock-videos.data';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';

function log(msg: string) {
  process.stdout.write(msg + '\n');
}

async function main() {
  const items = MOCK_YOUTUBE_DATA.items;
  const total = items.length;

  log('');
  log(`${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  log(`${BOLD}  Hype Tech Hub — Video Seed${RESET}`);
  log(`${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  log(`${DIM}  Source : mock-videos.data.ts${RESET}`);
  log(`${DIM}  Total  : ${total} videos${RESET}`);
  log('');

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const num = String(i + 1).padStart(2, '0');

    const exists = await prisma.video.findUnique({ where: { id: item.id }, select: { id: true } });

    const result = await prisma.video.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        publishedAt: new Date(item.snippet.publishedAt),
        thumbnailUrl: item.snippet.thumbnails.high.url,
        viewCount: parseInt(item.statistics.viewCount, 10),
        likeCount: parseInt(item.statistics.likeCount, 10),
        commentCount:
          item.statistics.commentCount !== undefined
            ? parseInt(item.statistics.commentCount, 10)
            : null,
      },
      select: { id: true, title: true },
    });

    const isNew = !exists;
    if (isNew) created++; else skipped++;

    const badge = isNew
      ? `${GREEN}+ created${RESET}`
      : `${YELLOW}~ exists ${RESET}`;

    log(`  ${DIM}[${num}/${total}]${RESET} ${badge}  ${CYAN}${result.id}${RESET}  ${DIM}${result.title.slice(0, 40)}${RESET}`);
  }

  log('');
  log(`${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  log(`${GREEN}${BOLD}  ✓ Done${RESET}  ${GREEN}${created} created${RESET}  ${YELLOW}${skipped} already existed${RESET}`);
  log(`${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  log('');
}

main()
  .catch((err) => {
    console.error('\x1b[31m[seed] Error:\x1b[0m', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
