const getDB = (() => {
  let db = null;

  return async () => {
    if (!db) {
      db = await new Promise((resolve, reject) => {
        const req = indexedDB.open("ITEM_LIST");

        req.onerror = () => {
          reject(null);
        };
        req.onsuccess = () => {
          resolve(req.result);
        };
        req.onupgradeneeded = (evt) => {
          const _db = evt.target.result;
          _db.createObjectStore("items", {
            keyPath: "id",
            autoIncrement: true,
          });
        };
      });
    }

    return db;
  };
})();

export async function add(item) {
  return new Promise(async (resolve, reject) => {
    const db = await getDB();
    if (!db) reject(false);

    const transaction = db.transaction(["items"], "readwrite");
    const itemStore = transaction.objectStore("items");
    const request = itemStore.add(item);

    request.onsuccess = () => {
      resolve(true);
    };
    request.onerror = () => {
      reject(false);
    };
  });
}

export async function remove(key) {
  return new Promise(async (resolve, reject) => {
    const db = await getDB();
    if (!db) reject(false);

    const transaction = db.transaction(["items"], "readwrite");
    const itemStore = transaction.objectStore("items");
    const request = itemStore.delete(key);

    request.onsuccess = () => {
      resolve(true);
    };
    request.onerror = () => {
      reject(false);
    };
  });
}

export async function get(key) {
  return new Promise(async (resolve, reject) => {
    const db = await getDB();
    if (!db) reject(false);

    const transaction = db.transaction(["items"]);
    const objectStore = transaction.objectStore("items");
    const request = objectStore.get(key);

    request.onerror = () => {
      reject(false);
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

export async function getAll() {
  return new Promise(async (resolve, reject) => {
    const db = await getDB();
    if (!db) reject(false);

    const transaction = db.transaction(["items"]);
    const objectStore = transaction.objectStore("items");
    const request = objectStore.getAll();

    request.onerror = () => {
      reject(false);
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}
export default {
  get,
  getAll,
  add,
  remove,
};
