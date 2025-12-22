// Konstanta
const NOTIFICATION_INTERVAL = 2 * 60 * 60 * 1000; // 2 jam dalam milidetik
const NOTIFICATION_TAG = "periodic-reminder";

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  event.waitUntil(clients.claim());
});

// Terima pesan dari aplikasi utama
self.addEventListener("message", (event) => {
  if (event.data.type === "START_NOTIFICATION_SCHEDULE") {
    console.log("Starting notification schedule");
    scheduleNextNotification();
  }
});

// Fungsi untuk schedule notifikasi berikutnya
function scheduleNextNotification() {
  // Hitung waktu untuk notifikasi berikutnya
  const now = Date.now();
  const nextNotificationTime = now + NOTIFICATION_INTERVAL;

  // Gunakan setTimeout di Service Worker
  // Note: Service Worker bisa di-terminate, jadi ini bukan solusi sempurna
  setTimeout(() => {
    showNotification();
    scheduleNextNotification(); // Schedule yang berikutnya
  }, NOTIFICATION_INTERVAL);
}

// Fungsi untuk menampilkan notifikasi
function showNotification() {
  const options = {
    body: "Sudah 2 jam berlalu! Jangan lupa istirahat.",
    icon: "/icon.png", // Ganti dengan path icon Anda
    badge: "/badge.png",
    tag: NOTIFICATION_TAG,
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: {
      timestamp: Date.now(),
    },
  };

  self.registration.showNotification("Pengingat 2 Jam", options);
}

// Handle click pada notifikasi
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Buka atau focus ke aplikasi
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Jika ada window yang terbuka, focus ke sana
      for (let client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      // Jika tidak ada, buka window baru
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});

// Periodic Sync API (Chrome/Edge only - lebih reliable)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "reminder-sync") {
    event.waitUntil(showNotification());
  }
});
