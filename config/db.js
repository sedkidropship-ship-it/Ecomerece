/**
 * JSON File Store — Drop-in replacement for MongoDB in local development.
 * Stores data in JSON files under /backend/data/
 * Can be swapped to Mongoose with minimal changes.
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Collection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    this._ensureFile();
  }

  _ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  _read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  /** Find all documents, optionally filtered */
  find(filter = {}) {
    let docs = this._read();
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null && value !== '') {
        docs = docs.filter(doc => {
          if (typeof value === 'object' && value.$regex) {
            return new RegExp(value.$regex, value.$options || '').test(doc[key]);
          }
          return doc[key] === value;
        });
      }
    }
    return docs;
  }

  /** Find one document by filter */
  findOne(filter = {}) {
    const docs = this.find(filter);
    return docs[0] || null;
  }

  /** Find by ID */
  findById(id) {
    return this.findOne({ id });
  }

  /** Insert a new document */
  create(doc) {
    const docs = this._read();
    const newDoc = {
      id: uuidv4(),
      ...doc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    docs.push(newDoc);
    this._write(docs);
    return newDoc;
  }

  /** Update a document by ID */
  findByIdAndUpdate(id, updates) {
    const docs = this._read();
    const index = docs.findIndex(d => d.id === id);
    if (index === -1) return null;
    docs[index] = {
      ...docs[index],
      ...updates,
      id: docs[index].id,
      createdAt: docs[index].createdAt,
      updatedAt: new Date().toISOString()
    };
    this._write(docs);
    return docs[index];
  }

  /** Delete a document by ID */
  findByIdAndDelete(id) {
    const docs = this._read();
    const index = docs.findIndex(d => d.id === id);
    if (index === -1) return null;
    const deleted = docs.splice(index, 1)[0];
    this._write(docs);
    return deleted;
  }

  /** Count documents */
  countDocuments(filter = {}) {
    return this.find(filter).length;
  }

  /** Delete all documents */
  deleteMany() {
    this._write([]);
  }

  /** Insert many documents */
  insertMany(docsArray) {
    const docs = this._read();
    const newDocs = docsArray.map(doc => ({
      id: uuidv4(),
      ...doc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    docs.push(...newDocs);
    this._write(docs);
    return newDocs;
  }
}

// Export collections
const db = {
  products: new Collection('products'),
  orders: new Collection('orders'),
  users: new Collection('users')
};

module.exports = db;
