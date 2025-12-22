// DATA ABSEN DARI MEMORI
let dataAbsen = JSON.parse(localStorage.getItem("absensi")) || {};

// NAVIGATION SCRIPT
const navLinks = document.querySelectorAll(".nav-link a");

// RESET DISPLAY
document.getElementById("chart").style.display = "none";
document.getElementById("notification").style.display = "none";

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((nav) => nav.classList.remove("active"));
    link.classList.add("active");
    let Tujuan = link.getAttribute("href").substring(1);
    document.getElementById(Tujuan).style.display = "block";
    if (Tujuan === "calender") {
      document.getElementById("chart").style.display = "none";
      document.getElementById("notification").style.display = "none";
    } else if (Tujuan === "chart") {
      document.getElementById("calender").style.display = "none";
      document.getElementById("notification").style.display = "none";
    } else if (Tujuan === "notification") {
      document.getElementById("calender").style.display = "none";
      document.getElementById("chart").style.display = "none";
    }
  });
});

// CALENDAR SCRIPT
const monthYear = document.getElementById("month-year");
const dates = document.getElementById("dates");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let currentDate = new Date();

function updateCalendar() {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // harusnya 0
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const totalDays = lastDay;
  const firstDayIndex = firstDay;
  const lastDayIndex = lastDay;

  const monthYearString = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  monthYear.textContent = monthYearString;

  let datesHTML = "";

  for (let i = firstDayIndex; i > 0; i--) {
    const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
    datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
  }
  for (let i = 1; i <= totalDays; i++) {
    // CEK STATUS DARI MEMORI
    const key = `${currentYear}-${currentMonth}-${i}`;
    const statusTerlanjurSimpan = dataAbsen[key] || ""; // isinya "succeed", "failed", atau kosong ""

    const date = new Date(currentYear, currentMonth, i);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeClass =
      date.toDateString() === new Date().toDateString() ? "active" : "";

    let futureClass = "";
    if (date > today) {
      futureClass = "nothedateyet";
    }

    datesHTML += `<div class="date ${activeClass} ${statusTerlanjurSimpan} ${futureClass}">${i}</div>`;
  }

  for (let i = 1; i <= 7 - lastDayIndex - 1; i++) {
    const nextDate = new Date(currentYear, currentMonth + 1, i);
    datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
  }

  dates.innerHTML = datesHTML;
}

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
});

updateCalendar();

// CONFIRMATION CALENDAR SCRIPT
const confirmElement = document.querySelector(".confirmation-calender");
const confirmationDate = document.getElementById("confirmation-date");
const succeedBtn = document.getElementById("succeed-btn");
const failedBtn = document.getElementById("failed-btn");
const screenFocus = document.querySelector(".screen-focus");
const dateElements = document.querySelectorAll(".date");

document.getElementById("dates").addEventListener("click", (e) => {
  if (
    e.target.classList.contains("date") &&
    !e.target.classList.contains("inactive") &&
    !e.target.classList.contains("nothedateyet")
  ) {
    elemenTerpilih = e.target;
    const selectedDate = elemenTerpilih.textContent;

    confirmationDate.textContent = selectedDate;
    confirmElement.style.display = "block";
    screenFocus.style.display = "block";
  }
});

// TOMBOL KONFIRMASI
succeedBtn.addEventListener("click", () => {
  if (elemenTerpilih) {
    elemenTerpilih.classList.add("succeed");
    elemenTerpilih.classList.remove("failed");
    confirmElement.style.display = "none";
    screenFocus.style.display = "none";

    const tanggal = elemenTerpilih.textContent;
    const bulan = currentDate.getMonth();
    const tahun = currentDate.getFullYear();

    const key = `${tahun}-${bulan}-${tanggal}`; // Kunci unik

    dataAbsen[key] = "succeed"; // Catat di objek
    localStorage.setItem("absensi", JSON.stringify(dataAbsen));
  }
  // EVENT ANIMASI BERHASIL
});

failedBtn.addEventListener("click", () => {
  if (elemenTerpilih) {
    elemenTerpilih.classList.add("failed");
    elemenTerpilih.classList.remove("succeed");
    confirmElement.style.display = "none";
    screenFocus.style.display = "none";

    const tanggal = elemenTerpilih.textContent;
    const bulan = currentDate.getMonth();
    const tahun = currentDate.getFullYear();

    const key = `${tahun}-${bulan}-${tanggal}`;

    dataAbsen[key] = "failed"; // Catat sebagai failed
    localStorage.setItem("absensi", JSON.stringify(dataAbsen)); // Simpan ke memori
  }
  // EVENT ANIMASI GAGAL
});

screenFocus.addEventListener("click", () => {
  confirmElement.style.display = "none";
  screenFocus.style.display = "none";
});

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
//                  Notification                      //
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

// Notification.requestPermission().then((permission) => {
//   if (permission === "granted") {
//     console.log("Izin diberikan, notifikasi akan dikirim.");
//     // Jika izin diberikan, daftarkan service worker
//     navigator.serviceWorker
//       .register("/service-worker.js")
//       .then((registration) => {
//         // Kirim notifikasi
//         registration.showNotification("Judul Notifikasi", {
//           body: "Ini adalah isi notifikasi dari situs Anda!",
//           icon: "icon.png",
//         });
//       });
//   } else {
//     console.log("Izin ditolak.");
//   }
// });

// const tombolNotifikasi = document.querySelector(".izin-notification");
// tombolNotifikasi.addEventListener("click", () => {
//   Notification.requestPermission().then((res) => {
//     if (res === "granted") {
//       notify();
//     } else if (res === "denied") {
//       console.log("Izin notifikasi ditolak oleh pengguna.");
//     } else if (res === "default") {
//       console.log("izin notifikasi ditutup tanpa keputusan.");
//     }
//   });
// });

// const aturJudulNotifikasi = document.getElementById("judul-notifikasi").value;
// const aturIntervalNotifikasi = document.getElementById(
//   "interval-notifikasi"
// ).value;
// let judulNotifikasi = `${aturJudulNotifikasi}`;
// let IntervalNotifikasi = aturIntervalNotifikasi * 1000;

// if ("Notification" in window) {
//   if (Notification.permission === "granted") {
//     notify();
//   } else {
//     Notification.requestPermission().then((res) => {
//       if (res === "granted") {
//         notify();
//       } else if (res === "denied") {
//         console.log("Izin notifikasi ditolak oleh pengguna.");
//       } else if (res === "default") {
//         console.log("izin notifikasi ditutup tanpa keputusan.");
//       }
//     });
//   }
// } else {
//   console.log("Browser tidak mendukung notifikasi.");
// }

// function notify() {
//   const notification = new Notification(`${judulNotifikasi}`, {
//     body: "-",
//     vibrate: [200, 100, 200],
//   });
// }

if ("serviceWorker" in navigator && "Notification" in window) {
  // Register Service Worker
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });

  // Event listener untuk tombol aktivasi
  document
    .getElementById("izin-notification")
    .addEventListener("click", async () => {
      try {
        // Minta izin notifikasi
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          document.getElementById("status").textContent = "Notifikasi Aktif!";

          // Kirim pesan ke Service Worker untuk mulai schedule
          navigator.serviceWorker.ready.then((registration) => {
            registration.active.postMessage({
              type: "START_NOTIFICATION_SCHEDULE",
            });
          });

          // Simpan status di localStorage
          localStorage.setItem("notificationEnabled", "true");
          localStorage.setItem("lastNotificationTime", Date.now());
        } else {
          document.getElementById("status").textContent =
            "Status: Izin ditolak";
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });

  // Cek status saat load
  if (localStorage.getItem("notificationEnabled") === "true") {
    document.getElementById("status").textContent = "Status: Notifikasi Aktif!";
  }
}
