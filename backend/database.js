import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'hidden_strengths.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initializeDatabase();
  }
});

// Wrap DB commands in Promises for cleaner async/await
export const query = {
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

function initializeDatabase() {
  db.serialize(async () => {
    try {
      // 1. Create Users Table
      await query.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'jobseeker',
          is_premium INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Users table checked/created.');

      // Check/Add role column if table already exists
      try {
        await query.run("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'jobseeker';");
        console.log('Database migrated: Added role column to users.');
      } catch (err) {
        // Column already exists, ignore error
      }

      // 2. Create Profiles Table
      await query.run(`
        CREATE TABLE IF NOT EXISTS profiles (
          user_id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          age_range TEXT,
          location TEXT,
          work_preference TEXT,
          constraints TEXT,
          education TEXT,
          jobs TEXT,
          military TEXT,
          parenting_caregiving INTEGER DEFAULT 0,
          community_roles TEXT,
          hobbies TEXT,
          personality TEXT,
          schedule TEXT,
          income_target TEXT,
          deal_breakers TEXT,
          clarifications TEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      console.log('Profiles table checked/created.');

      // Check/Add clarifications column if table already exists
      try {
        await query.run('ALTER TABLE profiles ADD COLUMN clarifications TEXT;');
        console.log('Database migrated: Added clarifications column to profiles.');
      } catch (err) {
        // Column already exists, ignore error
      }

      // 3. Create Resumes Table
      await query.run(`
        CREATE TABLE IF NOT EXISTS resumes (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          job_family_id TEXT NOT NULL,
          summary TEXT,
          experience TEXT,
          skills TEXT,
          cover_letter TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      console.log('Resumes table checked/created.');

      // 4. Create Employer Profiles Table
      await query.run(`
        CREATE TABLE IF NOT EXISTS employer_profiles (
          user_id TEXT PRIMARY KEY,
          company_name TEXT NOT NULL,
          industry TEXT,
          hiring_needs TEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      console.log('Employer profiles table checked/created.');
    } catch (err) {
      console.error('Error initializing tables:', err);
    }
  });
}

export default db;
