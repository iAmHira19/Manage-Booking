// Example Web API 2 controller (BookingController.cs) for older ASP.NET projects
// Place under Controllers/BookingController.cs in a Web API 2 project

using System.Web.Http;

public class BookingController : ApiController
{
    // GET api/Booking/Details?PNR=XXXX
    [HttpGet]
    [Route("api/Booking/Details")]
    public IHttpActionResult Details(string PNR)
    {
        if (string.IsNullOrEmpty(PNR))
            return BadRequest("PNR required");

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

    // POST api/Booking/ResendTicketDocument
    [HttpPost]
    [Route("api/Booking/ResendTicketDocument")]
    public IHttpActionResult ResendTicketDocument([FromBody] dynamic body)
    {
        return Ok(new { success = true, message = "Resend simulated" });
    }
}
