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
      updateChart();
      setupYearFilter();
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

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
//                      Chart                         //
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
let myPieChart;
let myBarChart1;
let myBarChart2;

function setupYearFilter() {
  const yearSelect = document.getElementById("year-filter");
  if (!yearSelect) return;

  const dataAbsen = JSON.parse(localStorage.getItem("absensi")) || {};

  // Ambil daftar tahun unik dari keys localStorage
  let years = [
    ...new Set(Object.keys(dataAbsen).map((key) => key.split("-")[0])),
  ];

  // Tambahkan tahun sekarang jika belum ada data
  const currentYear = new Date().getFullYear().toString();
  if (!years.includes(currentYear)) {
    years.push(currentYear);
  }

  years.sort((a, b) => b - a);

  // Isi dropdown dan pastikan tahun sekarang terpilih secara default
  yearSelect.innerHTML = years
    .map(
      (y) =>
        `<option value="${y}" ${
          y === currentYear ? "selected" : ""
        }>${y}</option>`
    )
    .join("");
}

function updateChart() {
  const filterRange = document.getElementById("chart-filter").value;
  const yearSelect = document.getElementById("year-filter");

  if (!yearSelect || !yearSelect.value) return;

  const selectedYear = yearSelect.value; // Ini String
  const dataTerbaru = JSON.parse(localStorage.getItem("absensi")) || {};

  let totalSucceed = 0;
  let totalFailed = 0;
  const monthlyData = Array(12)
    .fill(0)
    .map(() => ({ succeed: 0, failed: 0 }));

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYearStr = now.getFullYear().toString();

  Object.keys(dataTerbaru).forEach((key) => {
    const parts = key.split("-");
    const year = parts[0]; // String
    const month = parseInt(parts[1]); // 0-11
    const status = dataTerbaru[key];

    // Validasi: Apakah tahun data sesuai dengan tahun yang dipilih di filter?
    if (year === selectedYear) {
      // Isi data untuk Bar Chart
      if (status === "succeed") monthlyData[month].succeed++;
      else if (status === "failed") monthlyData[month].failed++;

      // Logic untuk Pie Chart
      let includeInPie = false;
      if (filterRange === "all") {
        includeInPie = true;
      } else if (filterRange === "month") {
        if (month === currentMonth && year === currentYearStr)
          includeInPie = true;
      } else if (filterRange === "week") {
        const dateKey = new Date(year, month, parseInt(parts[2]));
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        if (dateKey >= startOfWeek && year === currentYearStr)
          includeInPie = true;
      }

      if (includeInPie) {
        if (status === "succeed") totalSucceed++;
        if (status === "failed") totalFailed++;
      }
    }
  });

  renderCharts(totalSucceed, totalFailed, monthlyData);
}

function renderCharts(pieSucceed, pieFailed, barData) {
  // 1. PIE CHART
  const ctxPie = document.getElementById("pie-chart").getContext("2d");
  if (myPieChart) myPieChart.destroy();
  myPieChart = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: ["Berhasil", "Gagal"],
      datasets: [
        {
          data: [pieSucceed, pieFailed],
          backgroundColor: ["#01e235", "#ff3b3b"],
        },
      ],
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } },
  });

  // 2. BAR CHART 1 (Jan-Jun)
  const ctxBar1 = document.getElementById("bar-chart1").getContext("2d");
  if (myBarChart1) myBarChart1.destroy();
  myBarChart1 = new Chart(ctxBar1, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
      datasets: [
        {
          label: "Berhasil",
          data: barData.slice(0, 6).map((d) => d.succeed),
          backgroundColor: "#01e235",
        },
        {
          label: "Gagal",
          data: barData.slice(0, 6).map((d) => d.failed),
          backgroundColor: "#ff3b3b",
        },
      ],
    },
    options: { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } },
  });

  // 3. BAR CHART 2 (Jul-Des)
  const ctxBar2 = document.getElementById("bar-chart2").getContext("2d");
  if (myBarChart2) myBarChart2.destroy();
  myBarChart2 = new Chart(ctxBar2, {
    type: "bar",
    data: {
      labels: ["Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
      datasets: [
        {
          label: "Berhasil",
          data: barData.slice(6, 12).map((d) => d.succeed),
          backgroundColor: "#01e235",
        },
        {
          label: "Gagal",
          data: barData.slice(6, 12).map((d) => d.failed),
          backgroundColor: "#ff3b3b",
        },
      ],
    },
    options: { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Jalankan setup filter tahun saat pertama kali load
  setupYearFilter();

  const yearF = document.getElementById("year-filter");
  const rangeF = document.getElementById("chart-filter");

  if (yearF) yearF.addEventListener("change", updateChart);
  if (rangeF) rangeF.addEventListener("change", updateChart);
});
