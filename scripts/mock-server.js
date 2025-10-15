// Simple mock server to emulate backend booking endpoints
// Run with: node scripts/mock-server.js

const http = require('http');
const { URL } = require('url');

// Note: changed to 8082 in case 8081 is privileged/used on some systems
const PORT = 8082;

function makeSampleResponse(pnr) {
  const p = pnr || 'SAMPLE01';
  return {
    pnr: p,
    passengers: [
      {
        id: 1,
        firstName: 'Muhammad',
        lastName: 'Ali',
        fullName: 'Muhammad Ali',
        airlineBookingRef: p,
        origin: 'Lahore',
        destination: 'Karachi',
        departureTime: '2024-01-15T14:30:00',
        arrivalTime: '2024-01-15T16:45:00',
        baggage: '20kg',
        class: 'Economy'
      }
    ],
    booking: {
      bookingReference: p,
      issueDate: '2024-01-10',
      flightNumber: 'PK 301',
      tripType: 'One Way',
      refundable: true
    },
    pdfBase64: null
  };
}

const endpoints = new Set([
  '/api/getItinerary',
  '/api/booking/getItinerary',
  '/api/manage/getItinerary',
  '/api/Itinerary',
  '/api/Booking/GetItinerary',
  '/api/ManageBooking/GetItinerary',
  '/api/BookingDetails',
  '/api/Booking/Details',
  '/api/resendTicketDocument',
  '/api/booking/resendTicketDocument',
  '/api/manage/resendTicketDocument',
  '/api/ResendTicketDocument',
  '/api/Booking/ResendTicketDocument',
  '/api/ManageBooking/ResendTicket',
  '/api/Booking/ResendEmail',
  '/api/ResendEmail'
]);

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Basic CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // If this is a resend endpoint and method is POST, accept JSON body
  if (req.method === 'POST' && pathname.toLowerCase().includes('resend')) {
    let body = '';
    req.on('data', (chunk) => body += chunk);
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        console.log('Resend request received:', pathname, parsed);
      } catch (e) {
        console.warn('Failed to parse POST body', e.message);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Resend simulated' }));
    });
    return;
  }

  if (endpoints.has(pathname)) {
    const pnr = url.searchParams.get('PNR') || url.searchParams.get('pnr') || 'SAMPLE01';
    const payload = makeSampleResponse(pnr);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
    return;
  }

  // Fallback: return helpful 404 for debugging
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Mock server: endpoint not found', requested: pathname }));
});

server.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Supported endpoints:');
  Array.from(endpoints).forEach(e => console.log(`  ${e}?PNR=XXXX`));
});
