import { JourneyItem } from "@/data/gallery";

const DB_NAME = "romnick_gallery_db_v2";
const STORE_NAME = "journey_records";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not available"));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save or update an item in IndexedDB (handles full data URLs without storage limits)
export async function saveJourneyRecord(item: JourneyItem): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error("Failed to save journey record to IndexedDB:", err);
  }
}

// Get all saved items sorted newest first
export async function getAllJourneyRecords(): Promise<JourneyItem[]> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const records: JourneyItem[] = req.result || [];
        // Filter out legacy dummy/sample items if any exist
        const cleaned = records.filter(
          (r) => r.id !== "journey-beed-scholar" && r.id !== "journey-ttl-demonstration"
        );
        cleaned.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        resolve(cleaned);
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

// Delete an item from IndexedDB
export async function deleteJourneyRecord(id: string): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // ignore
  }
}
