// Example ASP.NET Core controller (BookingController.cs)
// Place in your ASP.NET Core Web API project under Controllers/BookingController.cs

using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    // GET api/Booking/Details?PNR=XXXX
    [HttpGet("Details")]
    public IActionResult Details([FromQuery] string PNR)
    {
        if (string.IsNullOrEmpty(PNR))
            return BadRequest(new { error = "PNR required" });

        var sample = new {
            pnr = PNR,
            passengers = new[] {
                new {
                    id = 1,
                    firstName = "Muhammad",
                    lastName = "Ali",
                    fullName = "Muhammad Ali",
                    airlineBookingRef = PNR,
                    origin = "Lahore",
                    destination = "Karachi",
                    departureTime = "2024-01-15T14:30:00",
                    arrivalTime = "2024-01-15T16:45:00",
                    baggage = "20kg",
                    @class = "Economy"
                }
            },
            booking = new {
                bookingReference = PNR,
                issueDate = "2024-01-10",
                flightNumber = "PK 301",
                tripType = "One Way",
                refundable = true
            }
        };

        return Ok(sample);
    }

    // POST api/Booking/ResendTicketDocument (example)
    [HttpPost("ResendTicketDocument")]
    public IActionResult ResendTicketDocument([FromBody] dynamic body)
    {
        // simulate sending
        return Ok(new { success = true, message = "Resend simulated" });
    }
}
