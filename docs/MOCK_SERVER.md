Mock server and backend examples

This file explains how to run the lightweight mock server included in this repo and gives example ASP.NET controller code you can use to fix the backend route.

Quick start (mock server)

1. Start the mock server (node required):

```powershell
node .\scripts\mock-server.js
```

The mock server listens on http://localhost:8082 and responds to the same candidate endpoints the frontend tries, including:
- /api/getItinerary?PNR=XXXX
- /api/booking/getItinerary?PNR=XXXX
- /api/manage/getItinerary?PNR=XXXX
- /api/Itinerary?PNR=XXXX
- /api/Booking/GetItinerary?PNR=XXXX
- /api/ManageBooking/GetItinerary?PNR=XXXX
- /api/BookingDetails?PNR=XXXX
- /api/Booking/Details?PNR=XXXX

It also handles POST resend endpoints (returns { success: true, message: 'Resend simulated' }).

2. Point the frontend to the mock server during development.

Temporary (PowerShell session):

```powershell
$env:NEXT_PUBLIC_BASE_URI = "http://localhost:8081"
npm run dev
```

Or add to `.env.local` in the repo root:

```
NEXT_PUBLIC_BASE_URI=http://localhost:8081
```

Then start your Next app as usual.

Test the mock endpoint (PowerShell):

```powershell
Invoke-RestMethod -Uri 'http://localhost:8082/api/Booking/Details?PNR=D70F54' -Method GET | ConvertTo-Json -Depth 5
```

You should get a JSON object matching the sample payload used by the frontend.

Stopping the mock server
- If you started it in a terminal, press Ctrl+C to stop.
- If started as a background process, kill the process or close the terminal.

Backend routing problem (why you saw the error)

The error:

{"Message":"No HTTP resource was found that matches the request URI 'http://localhost:8081/api/Booking/Details?PNR=D70F54'.","MessageDetail":"No type was found that matches the controller named 'Booking'."}

This indicates the backend does not expose a controller named `BookingController` (or the route templates do not match). To fix this, either add a controller named `BookingController` or update the routing on the backend.

Example ASP.NET controllers are included under `scripts/backend_examples/`.

Next steps

- Run the mock server to unblock frontend UI work quickly.
- If you own the backend, add/rename the controller as shown in the examples or configure the routes to match one of the `possibleEndpoints` used by the frontend.

If you'd like, I can also:
- Create a minimal Docker Compose setup to run a mock server alongside the frontend.
- Generate a more detailed backend sample project (ASP.NET Core Web API) with the controller wired up.

