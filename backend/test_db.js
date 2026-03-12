const fs = require('fs');
const mongoose = require('mongoose');

async function test() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/vigisense_db');
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    fs.writeFileSync('c:\\Users\\Sri Charan\\OneDrive\\Desktop\\unnati6\\backend\\users.json', JSON.stringify(users, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

test();
