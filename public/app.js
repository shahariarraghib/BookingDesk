const state = {
  shows: [],
  selectedShow: null,
  seats: [],
  selectedSeats: new Map(),
};

const $ = (selector) => document.querySelector(selector);
const status = $("#status");
const seatStatus = $("#seat-status");

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      body.message || body.error || `Request failed (${response.status})`,
    );
  return body;
}

function formatDate(value) {
  if (!value) return "Timing not set";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function showTitle(show) {
  return show.movieId?.title || show.movieId?.name || "Untitled show";
}

function renderShows() {
  const container = $("#shows");
  if (!state.shows.length) {
    container.innerHTML =
      '<p class="status muted">No shows available right now.</p>';
    return;
  }
  container.innerHTML = state.shows
    .map(
      (show, index) => `
    <article class="show-card">
      <div>
        <span class="show-number">SHOW ${String(index + 1).padStart(2, "0")}</span>
        <h3>${showTitle(show)}</h3>
        <p>${show.screen || "Screen TBD"} · ${formatDate(show.timing)}</p>
      </div>
      <button class="button button-dark view-seats" data-id="${show._id}" type="button">View seats <span>→</span></button>
    </article>
  `,
    )
    .join("");
  document
    .querySelectorAll(".view-seats")
    .forEach((button) =>
      button.addEventListener("click", () => loadSeats(button.dataset.id)),
    );
}

async function loadShows() {
  status.className = "status";
  status.textContent = "Loading shows...";
  try {
    const body = await request("/api/shows?page=1&limit=50");
    state.shows = Array.isArray(body.data) ? body.data : [];
    renderShows();
    status.textContent = `${state.shows.length} show${state.shows.length === 1 ? "" : "s"} found`;
  } catch (error) {
    status.className = "status error";
    status.textContent = error.message;
    $("#shows").innerHTML = "";
  }
}

function renderSeats() {
  $("#seats").innerHTML = state.seats
    .map((seat) => {
      const selected = state.selectedSeats.has(seat.seatNumber);
      return `<button class="seat${selected ? " selected" : ""}" data-seat="${seat.seatNumber}" type="button"><strong>${seat.seatNumber}</strong><small>৳${seat.price ?? 0}</small></button>`;
    })
    .join("");
  document
    .querySelectorAll(".seat")
    .forEach((button) =>
      button.addEventListener("click", () => toggleSeat(button.dataset.seat)),
    );
  updateSelection();
}

async function loadSeats(showId) {
  state.selectedShow = state.shows.find((show) => show._id === showId);
  state.selectedSeats.clear();
  seatStatus.className = "status";
  seatStatus.textContent = "Loading available seats...";
  $("#booking-title").textContent = `${showTitle(state.selectedShow)} seats`;
  try {
    const body = await request(`/api/shows/${showId}/seats`);
    state.seats = Array.isArray(body.data) ? body.data : [];
    renderSeats();
    seatStatus.textContent = `${body.totalAvailableSeats ?? state.seats.length} seats available`;
  } catch (error) {
    state.seats = [];
    $("#seats").innerHTML = "";
    seatStatus.className = "status error";
    seatStatus.textContent = error.message;
    updateSelection();
  }
}

function toggleSeat(seatNumber) {
  const seat = state.seats.find((item) => item.seatNumber === seatNumber);
  if (!seat) return;
  if (state.selectedSeats.has(seatNumber))
    state.selectedSeats.delete(seatNumber);
  else state.selectedSeats.set(seatNumber, seat);
  renderSeats();
}

function updateSelection() {
  const seats = [...state.selectedSeats.values()];
  $("#seat-count").textContent = `${seats.length} selected`;
  $("#total").textContent =
    `৳${seats.reduce((sum, seat) => sum + Number(seat.price || 0), 0)}`;
  $("#book-button").disabled = !state.selectedShow || seats.length === 0;
}

$("#refresh-shows").addEventListener("click", loadShows);
$("#book-button").addEventListener("click", () => {
  seatStatus.className = "status success";
  seatStatus.textContent =
    "Seats selected. Booking confirmation requires an authenticated user in the current API.";
});
loadShows();
