const { DB_PATH, resetAndSeed } = require('./models');

try {
  resetAndSeed();
  console.log(`SQLite database seeded successfully: ${DB_PATH}`);
  process.exit(0);
} catch (err) {
  console.error('Database seeding failed:', err.message);
  process.exit(1);
}
