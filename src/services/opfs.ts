const OPFS_FILE = 'pl-tracker-backup.json';

async function getRoot(): Promise<FileSystemDirectoryHandle | null> {
  try {
    return await navigator.storage.getDirectory();
  } catch {
    return null;
  }
}

export async function writeToOPFS(data: string): Promise<boolean> {
  const root = await getRoot();
  if (!root) return false;

  try {
    const handle = await root.getFileHandle(OPFS_FILE, { create: true });
    const writable = await handle.createWritable();
    await writable.write(data);
    await writable.close();
    return true;
  } catch {
    return false;
  }
}

export async function readFromOPFS(): Promise<string | null> {
  const root = await getRoot();
  if (!root) return null;

  try {
    const handle = await root.getFileHandle(OPFS_FILE);
    const file = await handle.getFile();
    const text = await file.text();
    return text || null;
  } catch {
    return null;
  }
}

export async function clearOPFS(): Promise<void> {
  const root = await getRoot();
  if (!root) return;

  try {
    await root.removeEntry(OPFS_FILE);
  } catch {
    // file doesn't exist, that's fine
  }
}

export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (navigator.storage?.persist) {
      return await navigator.storage.persist();
    }
    return false;
  } catch {
    return false;
  }
}
