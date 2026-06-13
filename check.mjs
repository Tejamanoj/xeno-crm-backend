import Database from 'better-sqlite3';
const db = new Database('C:/Users/tejam/OneDrive/Desktop/xeno-crm/crm.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables);
console.log('Customers:', db.prepare('SELECT COUNT(*) as c FROM customers').get());
console.log('Orders:', db.prepare('SELECT COUNT(*) as c FROM orders').get());