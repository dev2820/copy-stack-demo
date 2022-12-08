const req = indexedDB.open("ITEM_LIST");
let db = null;
req.onerror = () => {
  alert("Why didn't you allow my web app to use IndexedDB?!");
};
req.onsuccess = () => {
  db = req.result;
};
req.onupgradeneeded = (evt) => {
  db = evt.target.result;
  const objectStore = db.createObjectStore("items", {
    keyPath: "id",
    autoIncrement: true,
  });

  // 인덱스 생성 코드
  // objectStore.createIndex("created", "created", { unique: true });

  objectStore.transaction.oncomplete = () => {
    const itemStore = db.transaction("items", "readwrite").objectStore("items");
    [{ created: 10, id: 1 }, { created: 20 }].forEach((item) => {
      itemStore.add(item);
    });
  };
};

export function add(item) {
  return new Promise((resolve, reject) => {
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

export function remove(key) {
  return new Promise((resolve, reject) => {
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

export function get(key) {
  return new Promise((resolve, reject) => {
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

export function getAll() {
  return new Promise((resolve, reject) => {
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
