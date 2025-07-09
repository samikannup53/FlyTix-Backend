module.exports = function generateTicketHTML(data) {
  const capitalize = (str) =>
    str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();

  const renderTrip = (info, label, isFirst) => {
    if (!info) return "";

    return `
    <div class="trip-section ${!isFirst ? "trip-border" : ""}">
      <div class="trip-header">
        <span class="trip-route">${info.departureCity} → ${
      info.arrivalCity
    }</span>
        ${
          data.tripType === "Roundtrip"
            ? `<span class="trip-label">${label}</span>`
            : ""
        }
      </div>
      <p class="trip-meta">
        ${info.departureDate} | ${info.airlineName} | Flight ${
      info.flightNumber
    } | ${capitalize(data.travelClass || "Economy")} Class
      </p>
      <div class="flight-info">
        <div class="airport-block">
          <img src="${info.airlineLogo}" alt="${info.airlineName}" />
          <div>
            <div class="airport-time">${info.departureTime}</div>
            <div class="airport-city">${info.departureCity} – ${
      info.departureCode
    }</div>
          </div>
        </div>
        <div class="timeline">
          <div class="timeline-info">${info.duration}</div>
          <div class="timeline-line"></div>
          <div class="timeline-stop">${info.stops}</div>
        </div>
        <div class="airport-block" style="justify-content: flex-end; text-align: right;">
          <div>
            <div class="airport-time">${info.arrivalTime}</div>
            <div class="airport-city">${info.arrivalCity} – ${
      info.arrivalCode
    }</div>
          </div>
        </div>
      </div>
    </div>`;
  };

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Flytix E-Ticket</title>
    <style>
      @page { size: A4; margin: 40px; }
      * { box-sizing: border-box; }
      body { font-family: Arial, sans-serif; background: #fff; margin: 0; padding: 0; color: #333; }

      .ticket { max-width: 794px; margin: 0 auto; padding: 24px 32px; }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .header img { height: 50px; max-width: 150px; object-fit: contain; }

      .title { font-size: 26px; font-weight: bold; color: #e91e63; }

      .info-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #ccc;
        padding: 20px 24px;
        border-radius: 10px;
        margin-bottom: 24px;
        background-color: #fafafa;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      }

      .info-left {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: 14px;
      }

      .info-row {
        display: flex;
        gap: 6px;
        line-height: 1.4;
      }

      .info-label {
        font-weight: 600;
        color: #555;
        min-width: 110px;
      }

      .info-value {
        font-weight: 500;
        color: #222;
      }

      .qr {
        flex-shrink: 0;
        text-align: center;
        margin-left: 40px;
      }

      .qr img {
        height: 100px;
        width: 100px;
        object-fit: contain;
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 4px;
      }

      .qr label {
        display: block;
        margin-top: 6px;
        font-size: 12px;
        color: #777;
      }

      .flight-details {
        background: #fff;
        padding: 24px;
        border: 1px solid #ccc;
        border-radius: 10px;
        margin-bottom: 24px;
      }

      .flight-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .flight-header h3 {
        font-size: 16px;
        font-weight: bold;
        color: #444;
        margin: 0;
      }

      .trip-section + .trip-section {
        border-top: 1px solid #eee;
        margin-top: 20px;
        padding-top: 20px;
      }

      .trip-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .trip-route {
        font-weight: bold;
        font-size: 14px;
      }

      .trip-meta {
        font-size: 13px;
        color: #666;
        margin-top: 8px;
      }

      .trip-label {
        font-size: 12px;
        font-weight: 600;
        color: #d81b60;
        background: #fce4ec;
        border: 1px solid #f8bbd0;
        padding: 2px 8px;
        border-radius: 12px;
        margin-left: 12px;
      }

      .flight-info {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
        gap: 20px;
      }

      .airport-block {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1 1 30%;
      }

      .airport-block img {
        width: 48px;
        height: 48px;
        object-fit: contain;
      }

      .airport-time {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }

      .airport-city {
        font-size: 13px;
        color: #555;
      }

      .timeline {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-width: 120px;
      }

      .timeline-line {
        height: 0.5px;
        width: 100%;
        background: #999;
        position: relative;
      }

      .timeline-info {
        font-size: 11px;
        font-weight: 500;
        color: #003f5c;
        text-align: center;
      }

      .timeline-stop {
        font-size: 11px;
        color: #777;
        text-align: center;
      }

      .section-row {
        display: flex;
        gap: 24px;
        margin-bottom: 24px;
      }

      .section {
        flex: 1;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 16px;
      }

      .section h2 {
        font-size: 16px;
        font-weight: bold;
        margin-top: 0;
        margin-bottom: 12px;
        border-bottom: 1px solid #eee;
        padding-bottom: 6px;
        color: #444;
      }

      .passenger-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: 14px;
      }

      .passenger-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;
      }

      .passenger-info {
        color: #333;
        font-weight: 500;
      }

      .fare-line {
        font-size: 14px;
        margin: 6px 0;
        display: flex;
        justify-content: space-between;
      }

      .fare-label {
        font-weight: 500;
        color: #555;
      }

      .fare-value {
        font-weight: bold;
        color: #222;
      }

      .footer {
        text-align: center;
        font-size: 11px;
        color: #777;
        margin-top: 40px;
        border-top: 1px dashed #ccc;
        padding-top: 12px;
      }
    </style>
  </head>
  <body>
    <div class="ticket">
      <!-- Header -->
      <div class="header">
        <img src="${data.logoBase64}" alt="Flytix Logo" />
        <div class="title">E-Ticket</div>
      </div>

      <!-- Booking Info -->
      <div class="info-bar">
        <div class="info-left">
          <div class="info-row"><span class="info-label">Booking ID:</span><span class="info-value">${
            data.bookingId
          }</span></div>
          <div class="info-row"><span class="info-label">Booking Date:</span><span class="info-value">${
            data.bookingConfirmedAt
          }</span></div>
          <div class="info-row"><span class="info-label">Status:</span><span class="info-value" style="color: green;">${
            data.status || "Confirmed"
          }</span></div>
          <div class="info-row"><span class="info-label">PNR:</span><span class="info-value">${
            data.pnr
          }</span></div>
        </div>
        <div class="qr">
          <img src="${data.qrBase64}" alt="QR Code" />
          <label>Scan to verify</label>
        </div>
      </div>

      <!-- Flight Details -->
      <div class="flight-details">
        <div class="flight-header">
          <h3>Flight Details</h3>
          <span style="font-size: 13px; font-weight: 500; color: #e91e63;">
            ${data.tripType === "Roundtrip" ? "Round Trip" : "One Way"}
          </span>
        </div>
        ${renderTrip(data.outboundInfo, "Onward", true)}
        ${
          data.tripType === "Roundtrip" && data.returnFlightInfo
            ? renderTrip(data.returnFlightInfo, "Return", false)
            : ""
        }
      </div>

      <!-- Passenger + Fare Info -->
      <div class="section-row">
        <div class="section">
          <h2>Passenger Details</h2>
          <div class="passenger-list">
            ${data.passengers
              .map(
                (p, index) => `
              <div class="passenger-row">
                <div class="passenger-info">
                  ${index + 1}. ${p.name} | ${p.age} | ${capitalize(
                  p.gender
                )} | ${p.category}
                </div>
              </div>`
              )
              .join("")}
          </div>
        </div>
        <div class="section">
          <h2>Fare & Contact</h2>
          <div class="fare-line"><span class="fare-label">Total Fare:</span><span class="fare-value">${
            data.fare
          }</span></div>
          <div class="fare-line"><span class="fare-label">Email:</span><span class="fare-value">${
            data.email
          }</span></div>
          <div class="fare-line"><span class="fare-label">Mobile:</span><span class="fare-value">${
            data.mobile || "-"
          }</span></div>
        </div>
      </div>

      <div class="footer">
        This is a system-generated ticket. Please carry a valid government-issued photo ID.<br/>
        Check-in closes 45 minutes before departure. Have a pleasant journey!
      </div>
    </div>
  </body>
  </html>`;
};
