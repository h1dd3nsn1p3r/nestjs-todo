import { db } from '@/data/db';

const seed = async (): Promise<void> => {
  try {
    console.log('[👉]: Seeding the database...');

    /**
     * Create tables and seed data here
     */
    db.exec(`CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT false NOT NULL
    )`);

    /**
     * Create tables and seed data here
     */
    db.exec(`INSERT INTO todos (title, completed) VALUES ('Todo 1', 0)`);
    db.exec(`INSERT INTO todos (title, completed) VALUES ('Todo 2', 0)`);

    /**
     * Close the database connection.
     */
    db.close();

    console.log('[👍]: Database seeded successfully');
  } catch (err: any) {
    throw new Error(err?.message || 'Failed to seed the database');
  }
};

seed();
