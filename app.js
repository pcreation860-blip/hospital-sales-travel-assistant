const state = JSON.parse(localStorage.getItem("hsTravelApp") || "null") || {
  city: "Bhubaneswar",
  locationDetected: false,
  location: null,
  selectedStay: null,
  customStays: [],
  selectedHospitalId: null,
  route: [],
  visits: [],
  cards: [],
  queue: ["Initial local database created"],
  cities: ["Bhubaneswar"],
};
if (!("selectedHospitalId" in state)) state.selectedHospitalId = null;
if (!("locationDetected" in state)) state.locationDetected = false;
if (!("location" in state)) state.location = null;
if (!("customStays" in state)) state.customStays = [];

const staySeeds = [
  { name: "City Backpackers Hostel", type: "Bunk Bed Hostel", price: 649, rating: 4.6, distance: 1.2, amenities: "AC, clean beds, clean bathrooms, lockers", source: "Hostelworld / Booking.com" },
  { name: "Metro Dorm Stay", type: "Bunk Bed Hostel", price: 590, rating: 4.3, distance: 2.4, amenities: "AC, clean bathrooms, Wi-Fi", source: "Agoda / Hostelz" },
  { name: "Railway Budget Pods", type: "Bunk Bed Hostel", price: 520, rating: 4.1, distance: 0.9, amenities: "AC dorm, clean bedding, shared bath", source: "Goibibo / MakeMyTrip" },
  { name: "Comfort Inn Budget", type: "Budget Hotel", price: 1180, rating: 4.4, distance: 3.1, amenities: "AC room, private bath, clean linen", source: "Booking.com / Goibibo" },
  { name: "Google Result Hostel", type: "Bunk Bed Hostel", price: 750, rating: 4.2, distance: 1.8, amenities: "Verify AC, beds, bathrooms before booking", source: "Google Maps sample" },
  { name: "Google Result Budget Hotel", type: "Budget Hotel", price: 1250, rating: 4.1, distance: 2.6, amenities: "Verify AC, beds, bathrooms before booking", source: "Google Maps sample" },
  { name: "Poolside Comfort Residency", type: "Luxury Stay With Pool", price: 2199, rating: 4.3, distance: 3.4, amenities: "Swimming pool, AC, clean room, clean bathroom, breakfast", source: "Luxury comparison sample" },
  { name: "Royal Orchid Pool Stay", type: "Luxury Stay With Pool", price: 3299, rating: 4.5, distance: 4.8, amenities: "Swimming pool, AC, premium room, clean bathroom, parking", source: "Luxury comparison sample" },
  { name: "Grand Azure Hotel", type: "Luxury Stay With Pool", price: 4899, rating: 4.7, distance: 5.2, amenities: "Swimming pool, AC, premium bedding, restaurant, gym", source: "Luxury comparison sample" },
];

const travelSites = [
  { site: "Booking.com", factor: 1.06 },
  { site: "Agoda", factor: 0.96 },
  { site: "Goibibo", factor: 0.92 },
  { site: "MakeMyTrip", factor: 1.02 },
  { site: "Hostelworld", factor: 0.98 },
  { site: "Google Hotels", factor: 1.0 },
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

const indianCities = [
  { city: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { city: "Howrah", lat: 22.5958, lon: 88.2636 },
  { city: "Bhubaneswar", lat: 20.2961, lon: 85.8245 },
  { city: "Cuttack", lat: 20.4625, lon: 85.8828 },
  { city: "Puri", lat: 19.8135, lon: 85.8312 },
  { city: "Rourkela", lat: 22.2604, lon: 84.8536 },
  { city: "Patna", lat: 25.5941, lon: 85.1376 },
  { city: "Ranchi", lat: 23.3441, lon: 85.3096 },
  { city: "Jamshedpur", lat: 22.8046, lon: 86.2029 },
  { city: "Durgapur", lat: 23.5204, lon: 87.3119 },
  { city: "Asansol", lat: 23.6739, lon: 86.9524 },
  { city: "Siliguri", lat: 26.7271, lon: 88.3953 },
  { city: "Guwahati", lat: 26.1445, lon: 91.7362 },
  { city: "Delhi", lat: 28.6139, lon: 77.2090 },
  { city: "Mumbai", lat: 19.0760, lon: 72.8777 },
  { city: "Pune", lat: 18.5204, lon: 73.8567 },
  { city: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { city: "Hyderabad", lat: 17.3850, lon: 78.4867 },
  { city: "Chennai", lat: 13.0827, lon: 80.2707 },
  { city: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  { city: "Surat", lat: 21.1702, lon: 72.8311 },
  { city: "Jaipur", lat: 26.9124, lon: 75.7873 },
  { city: "Lucknow", lat: 26.8467, lon: 80.9462 },
  { city: "Kanpur", lat: 26.4499, lon: 80.3319 },
  { city: "Varanasi", lat: 25.3176, lon: 82.9739 },
  { city: "Nagpur", lat: 21.1458, lon: 79.0882 },
  { city: "Indore", lat: 22.7196, lon: 75.8577 },
  { city: "Bhopal", lat: 23.2599, lon: 77.4126 },
  { city: "Raipur", lat: 21.2514, lon: 81.6296 },
  { city: "Visakhapatnam", lat: 17.6868, lon: 83.2185 },
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

function distanceKm(aLat, aLon, bLat, bLon) {
  const earthRadius = 6371;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function nearestIndianCity(lat, lon) {
  return indianCities
    .map((item) => ({ ...item, distance: distanceKm(lat, lon, item.lat, item.lon) }))
    .sort((a, b) => a.distance - b.distance)[0];
}

function googleMapsSearchUrl(query) {
  if (state.location?.lat && state.location?.lon) {
    return `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${state.location.lat},${state.location.lon},14z`;
  }
  return `https://www.google.com/maps/search/${encodeURIComponent(`${query} in ${state.city}`)}`;
}

function travelSiteSearchUrl(site, stayName) {
  const query = encodeURIComponent(`${stayName} ${state.city}`);
  const urls = {
    "Booking.com": `https://www.booking.com/searchresults.html?ss=${query}`,
    Agoda: `https://www.agoda.com/search?text=${query}`,
    Goibibo: `https://www.goibibo.com/hotels/find-hotels-in-${encodeURIComponent(state.city)}/?searchText=${query}`,
    MakeMyTrip: `https://www.makemytrip.com/hotels/hotel-listing/?searchText=${query}`,
    Hostelworld: `https://www.hostelworld.com/search?search_keywords=${query}`,
    "Google Hotels": `https://www.google.com/travel/hotels?q=${query}`,
  };
  return urls[site] || googleMapsSearchUrl(stayName);
}

function comparisonPrices(stay) {
  return travelSites
    .filter((item) => stay.type !== "Budget Hotel" || item.site !== "Hostelworld")
    .map((item, index) => ({
      site: item.site,
      price: Math.max(350, Math.round(Number(stay.price || 0) * item.factor + index * 37)),
      url: travelSiteSearchUrl(item.site, stay.name),
    }))
    .sort((a, b) => a.price - b.price);
}

function openGoogleStaySearch(kind) {
  const query = kind === "hostel"
    ? "bunk bed hostels near me with AC"
    : kind === "luxury"
      ? "luxury hotel with swimming pool near me best price"
      : "budget hotels near me with AC";
  window.open(googleMapsSearchUrl(query), "_blank");
  addQueue(`Opened Google ${kind} search`);
  save();
}

function detectCurrentCity() {
  if (!navigator.geolocation) {
    alert("Location is not supported in this browser. Please type the city manually.");
    return;
  }

  document.getElementById("detectBtn").textContent = "...";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const match = nearestIndianCity(latitude, longitude);
      state.city = match.city;
      state.locationDetected = true;
      state.location = {
        lat: latitude,
        lon: longitude,
        matchedCity: match.city,
        distanceKm: Number(match.distance.toFixed(1)),
        detectedAt: new Date().toISOString(),
      };
      if (!state.cities.includes(state.city)) state.cities.push(state.city);
      addQueue(`Location detected: ${state.city}`);
      document.getElementById("detectBtn").textContent = "◎";
      save();
    },
    () => {
      document.getElementById("detectBtn").textContent = "◎";
      alert("Please allow location permission, or type your city manually.");
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 }
  );
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
  return [...staySeeds, ...state.customStays]
    .map((stay, index) => ({
      ...stay,
      id: `stay-${index}`,
      city: state.city,
      score: stay.rating * 20 - stay.price / 100 - stay.distance,
    }))
    .sort((a, b) => b.score - a.score || b.rating - a.rating || a.price - b.price || a.distance - b.distance);
}

function getLuxuryPoolResults() {
  return [...staySeeds, ...state.customStays]
    .filter((stay) => stay.type === "Luxury Stay With Pool" || /pool|swimming/i.test(stay.amenities || ""))
    .map((stay, index) => ({
      ...stay,
      id: `luxury-${index}`,
      city: state.city,
      score: stay.rating * 20 - stay.price / 100 - stay.distance,
    }))
    .sort((a, b) => a.price - b.price || b.rating - a.rating || a.distance - b.distance);
}

function renderStayCards(stays) {
  const container = document.getElementById("stayResults");
  container.innerHTML = "";
  stays.forEach((stay) => {
    const card = document.createElement("article");
    card.className = "result-card";
    card.innerHTML = `
      <div class="stay-photo" aria-hidden="true"></div>
      <div>
        <strong>${stay.name}</strong>
        <span>${stay.type} / ${stay.source}</span><br />
        <span>${money(stay.price)} per night / Rating ${stay.rating} / ${stay.distance} km</span><br />
        <span>${stay.amenities}</span><br />
        <span>Compare score ${Math.round(stay.score)} / ranked by review, price, distance</span>
      </div>
      <div class="contact-actions">
        ${stay.link ? `<a href="${stay.link}" target="_blank">Open</a>` : `<a href="${googleMapsSearchUrl(stay.name + " " + state.city)}" target="_blank">Google</a>`}
        <button class="mini-btn" data-stay="${stay.id}">Select</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderStayResults() {
  renderStayCards(getStayResults());
}

function renderLuxuryPoolResults() {
  renderStayCards(getLuxuryPoolResults());
  addQueue("Luxury pool stays sorted cheapest to highest");
  save();
}

function addManualStay() {
  const name = document.getElementById("manualStayName").value.trim();
  if (!name) {
    alert("Add the stay name first.");
    return;
  }
  const stay = {
    name,
    type: document.getElementById("manualStayType").value,
    price: Number(document.getElementById("manualStayPrice").value || 0),
    rating: Number(document.getElementById("manualStayRating").value || 0),
    distance: Number(document.getElementById("manualStayDistance").value || 0),
    amenities: document.getElementById("manualStayAmenities").value.trim() || "Verify AC, clean beds, clean bathrooms",
    link: document.getElementById("manualStayLink").value.trim(),
    source: "Added from Google",
  };
  state.customStays.unshift(stay);
  addQueue(`Stay added for comparison: ${stay.name}`);
  document.getElementById("manualStayName").value = "";
  document.getElementById("manualStayPrice").value = "";
  document.getElementById("manualStayRating").value = "";
  document.getElementById("manualStayDistance").value = "";
  document.getElementById("manualStayAmenities").value = "";
  document.getElementById("manualStayLink").value = "";
  save();
}

function renderSelectedStay() {
  const box = document.getElementById("selectedStay");
  const compareBox = document.getElementById("priceCompare");
  const routeStart = document.getElementById("routeStart");
  if (!state.selectedStay) {
    box.className = "empty-state";
    box.textContent = "Choose an accommodation to start route planning.";
    compareBox.innerHTML = "";
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
  compareBox.innerHTML = `
    <h2>Compare Prices</h2>
    <p>Same stay across travel websites. Cheapest appears first.</p>
    <div class="price-list">
      ${comparisonPrices(state.selectedStay).map((item) => `
        <div class="price-row">
          <span>${item.site}</span>
          <strong>${money(item.price)}</strong>
          <a href="${item.url}" target="_blank">Book</a>
        </div>
      `).join("")}
    </div>
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
  document.getElementById("locationStatus").textContent = state.locationDetected && state.location
    ? `Detected near ${state.location.matchedCity} (${state.location.distanceKm} km match)`
    : "Tap ◎ to detect your city";
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
  detectCurrentCity();
});

document.getElementById("findStayBtn").addEventListener("click", () => {
  if (!state.locationDetected) detectCurrentCity();
  renderStayResults();
  addQueue("Nearby stay comparison updated");
  save();
});

document.getElementById("googleHostelsBtn").addEventListener("click", () => {
  openGoogleStaySearch("hostel");
});

document.getElementById("googleHotelsBtn").addEventListener("click", () => {
  openGoogleStaySearch("hotel");
});

document.getElementById("luxuryPoolBtn").addEventListener("click", () => {
  openGoogleStaySearch("luxury");
  renderLuxuryPoolResults();
});

document.getElementById("addManualStayBtn").addEventListener("click", addManualStay);

document.getElementById("stayResults").addEventListener("click", (event) => {
  const button = event.target.closest("[data-stay]");
  if (!button) return;
  state.selectedStay = [...getStayResults(), ...getLuxuryPoolResults()].find((stay) => stay.id === button.dataset.stay);
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

if (!state.locationDetected) {
  setTimeout(detectCurrentCity, 800);
}
