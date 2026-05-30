const state = JSON.parse(localStorage.getItem("hsTravelApp") || "null") || {
  city: "Bhubaneswar",
  selectedStay: null,
  selectedHospitalId: null,
  route: [],
  visits: [],
  cards: [],
  queue: ["Initial local database created"],
  cities: ["Bhubaneswar"],
};
if (!("selectedHospitalId" in state)) state.selectedHospitalId = null;

const staySeeds = [
  { name: "City Backpackers Hostel", type: "Bunk Bed Hostel", price: 649, rating: 4.6, distance: 1.2, amenities: "AC, clean beds, clean bathrooms, lockers", source: "Hostelworld / Booking.com" },
  { name: "Metro Dorm Stay", type: "Bunk Bed Hostel", price: 590, rating: 4.3, distance: 2.4, amenities: "AC, clean bathrooms, Wi-Fi", source: "Agoda / Hostelz" },
  { name: "Railway Budget Pods", type: "Bunk Bed Hostel", price: 520, rating: 4.1, distance: 0.9, amenities: "AC dorm, clean bedding, shared bath", source: "Goibibo / MakeMyTrip" },
  { name: "Comfort Inn Budget", type: "Budget Hotel", price: 1180, rating: 4.4, distance: 3.1, amenities: "AC room, private bath, clean linen", source: "Booking.com / Goibibo" },
];

const hospitalNames = [
  "Shisu Mangal Hospital", "Health Point", "Bellvue", "LifeSpring IVF Centre",
  "Medistar Hospital", "Sparsh Multi Speciality", "Sunrise Diagnostics", "Nova Fertility Clinic",
  "HealthFirst Hospital", "Kalinga Nursing Home", "Blue Cross Medical Centre", "Urban Care Hospital",
  "Motherhood Fertility", "Prime Diagnostics", "Goodlife Hospital", "Sanjeevani Specialty Centre",
  "Fortune Nursing Home", "Wellness Multispeciality", "City Heart Centre", "Greenview Hospital",
  "Shanti IVF", "Medline Diagnostics", "Trustcare Hospital", "Lotus Nursing Home",
  "Hope Fertility Clinic", "Silverline Hospital", "Northstar Healthcare", "Harmony Medical Centre",
];

const hospitalTypes = [
  "Private Hospital",
  "Multi-speciality",
  "Nursing Home",
  "Fertility / IVF",
  "Diagnostic Hospital",
  "Specialty Centre",
];

function save() {
  localStorage.setItem("hsTravelApp", JSON.stringify(state));
  renderAll();
}

function money(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function currentTime() {
  return new Date().toTimeString().slice(0, 5);
}

function setView(viewId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-btn").forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
  document.getElementById("pageTitle").textContent = document.querySelector(`[data-view="${viewId}"]`).textContent;
}

function addQueue(item) {
  state.queue.unshift(`${item} - ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
  state.queue = state.queue.slice(0, 8);
}

function getStayResults() {
  return staySeeds
    .map((stay, index) => ({
      ...stay,
      id: `stay-${index}`,
      city: state.city,
      score: stay.rating * 20 - stay.price / 100 - stay.distance,
    }))
    .sort((a, b) => b.rating - a.rating || a.price - b.price || a.distance - b.distance);
}

function renderStayResults() {
  const container = document.getElementById("stayResults");
  container.innerHTML = "";
  getStayResults().forEach((stay) => {
    const card = document.createElement("article");
    card.className = "result-card";
    card.innerHTML = `
      <div class="stay-photo" aria-hidden="true"></div>
      <div>
        <strong>${stay.name}</strong>
        <span>${stay.type} / ${stay.source}</span><br />
        <span>${money(stay.price)} per night / Rating ${stay.rating} / ${stay.distance} km</span><br />
        <span>${stay.amenities}</span>
      </div>
      <button class="mini-btn" data-stay="${stay.id}">Select</button>
    `;
    container.appendChild(card);
  });
}

function renderSelectedStay() {
  const box = document.getElementById("selectedStay");
  const routeStart = document.getElementById("routeStart");
  if (!state.selectedStay) {
    box.className = "empty-state";
    box.textContent = "Choose an accommodation to start route planning.";
    routeStart.textContent = "Start: No stay selected";
    return;
  }
  box.className = "lead-item";
  box.innerHTML = `
    <strong>${state.selectedStay.name}</strong>
    <span>${state.selectedStay.city} / ${state.selectedStay.type}</span><br />
    <span>${money(state.selectedStay.price)} / Rating ${state.selectedStay.rating} / ${state.selectedStay.distance} km</span><br />
    <span>${state.selectedStay.amenities}</span>
  `;
  routeStart.textContent = `Start: ${state.selectedStay.name}`;
}

function generateRoute() {
  const startHour = 9;
  state.route = hospitalNames.slice(0, 26).map((name, index) => {
    const distance = (0.8 + (index % 7) * 0.7 + Math.floor(index / 6) * 0.5).toFixed(1);
    const minutes = startHour * 60 + index * 24;
    const eta = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    return {
      id: `hospital-${index + 1}`,
      seq: index + 1,
      name: `${state.city} ${name}`,
      type: hospitalTypes[index % hospitalTypes.length],
      address: `${12 + index}, Medical Road, ${state.city}`,
      gps: `${(20.28 + index * 0.004).toFixed(5)}, ${(85.78 + index * 0.003).toFixed(5)}`,
      distance,
      eta,
      phone: `+91 9${(800000000 + index * 73421).toString().slice(0, 9)}`,
      website: `https://maps.google.com/?q=${encodeURIComponent(state.city + " " + name)}`,
    };
  });
  state.selectedHospitalId = state.route[0]?.id || null;
  addQueue("Route plan generated");
  save();
}

function renderRoute() {
  const body = document.getElementById("routeTable");
  body.innerHTML = "";
  state.route.forEach((stop) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${stop.seq}</td>
      <td><strong>${stop.name}</strong><br /><span>${stop.address}</span></td>
      <td>${stop.type}</td>
      <td>${stop.distance} km</td>
      <td>${stop.eta}</td>
      <td><button class="mini-btn" data-visit="${stop.id}">Open CRM</button></td>
    `;
    body.appendChild(row);
  });

  const total = state.route.reduce((sum, stop) => sum + Number(stop.distance), 0);
  document.getElementById("routeDistance").textContent = `Distance: ${total.toFixed(1)} km`;
  document.getElementById("routeTime").textContent = `ETA: ${state.route.length ? "10.4 hr" : "0 hr"}`;
}

function openVisit(stopId) {
  const stop = state.route.find((item) => item.id === stopId);
  if (!stop) return;
  state.selectedHospitalId = stop.id;
  loadHospitalIntoCrm(stop);
  addQueue(`CRM opened for ${stop.name}`);
  localStorage.setItem("hsTravelApp", JSON.stringify(state));
  renderAll();
  setView("crm");
}

function loadHospitalIntoCrm(stop) {
  document.getElementById("hospitalName").value = stop.name;
  document.getElementById("hospitalAddress").value = stop.address;
  document.getElementById("gps").value = stop.gps;
  document.getElementById("visitDate").value = today();
  document.getElementById("visitTime").value = currentTime();
  document.getElementById("personMet").value = "";
  document.getElementById("designation").value = "";
  document.getElementById("mobile").value = stop.phone;
  document.getElementById("email").value = "";
  document.getElementById("requirement").value = "Scrub suits, lab coats, nursing uniforms";
  document.getElementById("orderValue").value = "";
  document.getElementById("followupDate").value = "";
  document.getElementById("remarks").value = "";
  document.getElementById("transcript").value = "";
  document.getElementById("aiSummary").value = "";
  document.getElementById("cardHospital").value = stop.name;
  document.getElementById("cardAddress").value = stop.address;
}

function renderHospitalSelect() {
  const select = document.getElementById("hospitalSelect");
  if (!select) return;
  select.innerHTML = "";
  if (!state.route.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Generate a route first";
    select.appendChild(option);
    return;
  }
  state.route.forEach((stop) => {
    const option = document.createElement("option");
    option.value = stop.id;
    option.textContent = `${stop.seq}. ${stop.name}`;
    select.appendChild(option);
  });
  if (!state.selectedHospitalId || !state.route.some((stop) => stop.id === state.selectedHospitalId)) {
    state.selectedHospitalId = state.route[0].id;
  }
  select.value = state.selectedHospitalId;
}

function saveVisit() {
  const selectedStop = state.route.find((item) => item.id === state.selectedHospitalId);
  const visit = {
    hospitalId: state.selectedHospitalId,
    hospital: document.getElementById("hospitalName").value.trim(),
    address: document.getElementById("hospitalAddress").value.trim(),
    gps: document.getElementById("gps").value.trim(),
    date: document.getElementById("visitDate").value,
    time: document.getElementById("visitTime").value,
    person: document.getElementById("personMet").value.trim(),
    designation: document.getElementById("designation").value.trim(),
    mobile: document.getElementById("mobile").value.trim(),
    email: document.getElementById("email").value.trim(),
    requirement: document.getElementById("requirement").value.trim(),
    orderValue: document.getElementById("orderValue").value,
    followupDate: document.getElementById("followupDate").value,
    remarks: document.getElementById("remarks").value.trim(),
    transcript: document.getElementById("transcript").value.trim(),
    aiSummary: document.getElementById("aiSummary").value.trim(),
    routeSequence: selectedStop?.seq || "",
  };
  if (!visit.hospital) {
    alert("Hospital name is required.");
    return;
  }
  state.visits.unshift(visit);
  addQueue(`Visit saved for ${visit.hospital}`);
  save();
}

function renderTimeline() {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";
  const selectedStop = state.route.find((item) => item.id === state.selectedHospitalId);
  const selectedName = selectedStop?.name || document.getElementById("hospitalName")?.value;
  const visits = state.visits.filter((visit) =>
    (state.selectedHospitalId && visit.hospitalId === state.selectedHospitalId) ||
    (selectedName && visit.hospital === selectedName)
  );
  if (!visits.length) {
    timeline.innerHTML = `<div class="empty-state">No saved visits for the selected hospital yet.</div>`;
    return;
  }
  visits.slice(0, 12).forEach((visit, index) => {
    const item = document.createElement("article");
    item.className = "timeline-item";
    item.innerHTML = `
      <strong>${visit.hospital}</strong>
      <span>Visit ${visits.length - index} / ${visit.date || "Today"} ${visit.time || ""}</span><br />
      <span>${visit.person || "Contact pending"} ${visit.designation ? "/ " + visit.designation : ""}</span><br />
      <span>${visit.requirement || "Requirement not added"} / Potential ${money(visit.orderValue)}</span><br />
      <span>${visit.remarks || visit.transcript || "Notes not added"}</span>
    `;
    timeline.appendChild(item);
  });
}

function simulateCardOcr() {
  const selectedStop = state.route.find((item) => item.id === state.selectedHospitalId);
  const routeHospital = selectedStop?.name || document.getElementById("hospitalName").value || `${state.city} Medistar Hospital`;
  document.getElementById("cardName").value = routeHospital.includes("Bellvue") ? "Mr. S. Roy" : "Dr. Ankit Sharma";
  document.getElementById("cardDesignation").value = routeHospital.includes("Bellvue") ? "Admin and Purchase Head" : "Purchase Manager";
  document.getElementById("cardHospital").value = routeHospital;
  document.getElementById("cardMobile").value = "+91 9830012345";
  document.getElementById("cardEmail").value = "purchase@examplehospital.in";
  document.getElementById("cardWebsite").value = "www.examplehospital.in";
  document.getElementById("cardAddress").value = selectedStop?.address || document.getElementById("hospitalAddress").value || `Medical Road, ${state.city}`;

  document.getElementById("personMet").value = document.getElementById("cardName").value;
  document.getElementById("designation").value = document.getElementById("cardDesignation").value;
  document.getElementById("mobile").value = document.getElementById("cardMobile").value;
  document.getElementById("email").value = document.getElementById("cardEmail").value;
  addQueue(`Business card scanned for ${routeHospital}`);
  save();
}

function saveCard() {
  const card = {
    hospitalId: state.selectedHospitalId,
    name: document.getElementById("cardName").value.trim(),
    designation: document.getElementById("cardDesignation").value.trim(),
    hospital: document.getElementById("cardHospital").value.trim(),
    mobile: document.getElementById("cardMobile").value.trim(),
    email: document.getElementById("cardEmail").value.trim(),
    website: document.getElementById("cardWebsite").value.trim(),
    address: document.getElementById("cardAddress").value.trim(),
    date: today(),
    city: state.city,
  };
  if (!card.name && !card.hospital) {
    alert("Add at least a person name or hospital.");
    return;
  }
  state.cards.unshift(card);
  addQueue(`Business card saved for ${card.name || card.hospital}`);
  save();
}

function renderCards() {
  const list = document.getElementById("cardList");
  list.innerHTML = "";
  const selectedStop = state.route.find((item) => item.id === state.selectedHospitalId);
  const selectedName = selectedStop?.name || document.getElementById("hospitalName")?.value;
  const cards = state.cards.filter((card) =>
    (state.selectedHospitalId && card.hospitalId === state.selectedHospitalId) ||
    (selectedName && card.hospital === selectedName)
  );
  if (!cards.length) {
    list.innerHTML = `<div class="empty-state">No business cards saved for the selected hospital.</div>`;
    return;
  }
  cards.forEach((card) => {
    const item = document.createElement("article");
    item.className = "result-card";
    item.innerHTML = `
      <div class="card-photo" aria-hidden="true"></div>
      <div>
        <strong>${card.name || "Unnamed contact"}</strong>
        <span>${card.designation || "Designation pending"} / ${card.hospital || "Hospital pending"}</span><br />
        <span>${card.mobile || "No mobile"} / ${card.email || "No email"}</span><br />
        <span>${card.city} / Collected ${card.date}</span>
      </div>
      <div class="contact-actions">
        <a href="tel:${card.mobile}">Call</a>
        <a href="https://wa.me/${card.mobile.replace(/\D/g, "")}">WhatsApp</a>
        <a href="mailto:${card.email}">Email</a>
      </div>
    `;
    list.appendChild(item);
  });
}

function simulateAudioNote() {
  const hospital = document.getElementById("hospitalName").value || `${state.city} hospital`;
  document.getElementById("transcript").value = `Recording started for ${hospital}. Speak meeting notes, deal details, fabric preference, order quantity, and instructions.`;
  addQueue("Recording started locally");
  save();
}

function stopAndTranscribeAudio() {
  const hospital = document.getElementById("hospitalName").value || `${state.city} hospital`;
  const person = document.getElementById("personMet").value || "the buyer";
  document.getElementById("transcript").value = `Auto transcription: Meeting at ${hospital} with ${person}. They liked breathable scrub suit fabric and requested samples for nurses and OT staff. Estimated requirement is 80 to 120 sets. They asked for quotation, size chart, color options, and delivery timeline. Follow up with purchase department after two days.`;
  document.getElementById("remarks").value = document.getElementById("remarks").value || "Deal note: send quotation, fabric sample, size chart, and color options. Follow up with purchase department.";
  addQueue("Recording transcribed and linked to selected hospital");
  save();
}

function createAiSummary() {
  const hospital = document.getElementById("hospitalName").value || "this hospital";
  const requirement = document.getElementById("requirement").value || "hospital uniform requirement";
  const notes = document.getElementById("remarks").value || document.getElementById("transcript").value || "no detailed notes yet";
  document.getElementById("aiSummary").value = [
    `Summary: ${hospital} is interested in ${requirement}.`,
    `Field notes: ${notes}`,
    "Key requirement: send catalogue, fabric samples, and price quotation.",
    "Next action: follow up with purchase or HR contact within 2 working days.",
    "Recommendation: mark as medium-to-high potential if order value is above Rs 50,000."
  ].join("\n");
  addQueue("AI meeting summary generated");
  save();
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportCsv() {
  const header = ["Hospital", "City", "Date", "Person", "Mobile", "Requirement", "Order Value", "Follow-up"];
  const rows = state.visits.map((visit) => [
    visit.hospital,
    state.city,
    visit.date,
    visit.person,
    visit.mobile,
    visit.requirement,
    visit.orderValue,
    visit.followupDate,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(","))
    .join("\n");
  downloadFile("hospital-sales-report.csv", csv, "text/csv");
}

function exportJson() {
  downloadFile("hospital-sales-backup.json", JSON.stringify(state, null, 2), "application/json");
}

function renderPriority() {
  const list = document.getElementById("priorityList");
  list.innerHTML = "";
  const items = state.visits.length
    ? state.visits.slice(0, 5).map((visit) => ({
        title: visit.hospital,
        meta: visit.followupDate ? `Follow-up on ${visit.followupDate}` : "Follow-up date pending",
        value: money(visit.orderValue),
      }))
    : [
        { title: "Generate first city route", meta: "Select stay, then create 26-stop plan", value: "Today" },
        { title: "Capture business cards", meta: "Link each card to hospital record", value: "Field task" },
        { title: "Run backup sync", meta: "Keep Firebase and Drive ready", value: "Required" },
      ];

  items.forEach((item) => {
    const row = document.createElement("article");
    row.className = "lead-item";
    row.innerHTML = `<strong>${item.title}</strong><span>${item.meta}</span><br /><span>${item.value}</span>`;
    list.appendChild(row);
  });
}

function renderBackup() {
  document.getElementById("queueList").innerHTML = state.queue.length
    ? state.queue.map((item) => `<div class="queue-item"><strong>Pending sync item</strong><br /><span>${item}</span></div>`).join("")
    : `<div class="empty-state">No pending offline items.</div>`;
}

function renderMetrics() {
  document.getElementById("cityInput").value = state.city;
  document.getElementById("citiesMetric").textContent = state.cities.length;
  document.getElementById("hospitalsMetric").textContent = state.route.length;
  document.getElementById("meetingsMetric").textContent = state.visits.length;
  document.getElementById("followupsMetric").textContent = state.visits.filter((visit) => visit.followupDate).length;
  document.getElementById("syncTime").textContent = `${state.queue.length} item${state.queue.length === 1 ? "" : "s"} pending`;
}

function runSync() {
  document.getElementById("syncLabel").textContent = "Syncing";
  document.getElementById("firebaseStatus").textContent = "Uploading";
  document.getElementById("driveStatus").textContent = "Uploading";
  setTimeout(() => {
    state.queue = [];
    document.getElementById("syncLabel").textContent = "Synced";
    document.getElementById("firebaseStatus").textContent = "Synced";
    document.getElementById("driveStatus").textContent = "Synced";
    save();
  }, 700);
}

function renderAll() {
  renderStayResults();
  renderSelectedStay();
  renderRoute();
  renderHospitalSelect();
  renderTimeline();
  renderCards();
  renderPriority();
  renderBackup();
  renderMetrics();
}

document.querySelectorAll(".nav-btn").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.jump));
});

document.getElementById("cityInput").addEventListener("change", (event) => {
  state.city = event.target.value.trim() || "Bhubaneswar";
  if (!state.cities.includes(state.city)) state.cities.push(state.city);
  addQueue(`City changed to ${state.city}`);
  save();
});

document.getElementById("detectBtn").addEventListener("click", () => {
  state.city = "Bhubaneswar";
  if (!state.cities.includes(state.city)) state.cities.push(state.city);
  addQueue("Location detected");
  save();
});

document.getElementById("findStayBtn").addEventListener("click", () => {
  renderStayResults();
  addQueue("Accommodation search completed");
  save();
});

document.getElementById("stayResults").addEventListener("click", (event) => {
  const button = event.target.closest("[data-stay]");
  if (!button) return;
  state.selectedStay = getStayResults().find((stay) => stay.id === button.dataset.stay);
  addQueue(`Accommodation selected: ${state.selectedStay.name}`);
  save();
});

document.getElementById("generateRouteBtn").addEventListener("click", generateRoute);

document.getElementById("routeTable").addEventListener("click", (event) => {
  const button = event.target.closest("[data-visit]");
  if (button) openVisit(button.dataset.visit);
});

document.getElementById("hospitalSelect").addEventListener("change", (event) => {
  state.selectedHospitalId = event.target.value;
  const stop = state.route.find((item) => item.id === state.selectedHospitalId);
  if (stop) loadHospitalIntoCrm(stop);
  addQueue(`Selected ${stop?.name || "route hospital"} in CRM`);
  save();
});

document.getElementById("loadHospitalBtn").addEventListener("click", () => {
  const stop = state.route.find((item) => item.id === document.getElementById("hospitalSelect").value);
  if (!stop) {
    alert("Generate a route first, then choose a hospital.");
    return;
  }
  state.selectedHospitalId = stop.id;
  loadHospitalIntoCrm(stop);
  addQueue(`Loaded ${stop.name} details into CRM`);
  save();
});

document.getElementById("saveVisitBtn").addEventListener("click", saveVisit);
document.getElementById("scanCardBtn").addEventListener("click", simulateCardOcr);
document.getElementById("saveCardBtn").addEventListener("click", saveCard);
document.getElementById("syncBtn").addEventListener("click", runSync);
document.getElementById("recordAudioBtn").addEventListener("click", simulateAudioNote);
document.getElementById("stopAudioBtn").addEventListener("click", stopAndTranscribeAudio);
document.getElementById("summarizeBtn").addEventListener("click", createAiSummary);
document.getElementById("exportCsvBtn").addEventListener("click", exportCsv);
document.getElementById("exportJsonBtn").addEventListener("click", exportJson);

if (!document.getElementById("visitDate").value) document.getElementById("visitDate").value = today();
if (!document.getElementById("visitTime").value) document.getElementById("visitTime").value = currentTime();

renderAll();
if (state.route.length && !document.getElementById("hospitalName").value) {
  const stop = state.route.find((item) => item.id === state.selectedHospitalId) || state.route[0];
  state.selectedHospitalId = stop.id;
  loadHospitalIntoCrm(stop);
  renderAll();
}
