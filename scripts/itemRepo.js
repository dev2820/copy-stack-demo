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

  objectStore.createIndex("created", "created", { unique: true });

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
    transaction.oncomplete = () => {
      console.log("add transaction success");
    };
    transaction.onerror = () => {
      console.log("add transaction failed");
    };

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

    transaction.oncomplete = () => {
      console.log("remove transaction success");
    };
    transaction.onerror = () => {
      console.log("remove transaction failed");
    };

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

    transaction.oncomplete = () => {
      console.log("get transaction complete");
    };
    transaction.onerror = () => {
      console.log("get transaction failed");
    };

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

    transaction.oncomplete = () => {
      console.log("getAll transaction complete");
    };
    transaction.onerror = () => {
      console.log("getAll transaction failed");
    };
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
