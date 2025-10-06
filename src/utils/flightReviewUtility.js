export function extractFlightSegments(response) {
  return response?.OfferListResponse.OfferID?.map((offer) =>
    offer.Product.flatMap(
      (product) =>
        // product.FlightSegment.map((segment) => ({
        // segmentId: segment.id,
        // sequence: segment.sequence,
        // carrier: segment.Flight.carrier,
        // flightNumber: segment.Flight.number,
        // operatingCarrierName: segment.Flight.operatingCarrierName,
        // duration: segment.Flight.duration,
        ({
          durationInMinutes: product.totalDurationInMinutes,
          // stopTime: Number(segment.connectionDurationInMinutes),
          Segments: product.FlightSegment,
          productId: product.id,
        })
      // departure: {
      //   durationInMinutes: segment.Flight.durationInMinutes,
      //   location: segment.Flight.Departure.location,
      //   dateUK: segment.Flight.Departure.dateUK,
      //   date: segment.Flight.Departure.date,
      //   time: segment.Flight.Departure.time,
      // },
      // arrival: {
      //   location: segment.Flight.Arrival.location,
      //   date: segment.Flight.Arrival.date,
      //   dateUK: segment.Flight.Arrival.dateUK,
      //   time: segment.Flight.Arrival.time,
      // },
    )
  );
  // )
  // );
}
export function extractPriceDetails(response) {
  return response?.OfferListResponse.OfferID?.map((offer) => ({
    totalPrice: offer.Price.TotalPrice,
    currency: offer.Price.CurrencyCode.value,
    basePrice: offer.Price.Base,
    taxes: offer.Price.TotalTaxes,
    priceBreakDown: offer.Price.PriceBreakdown,
  }));
}
export function extractBaggageAllowance(response) {
  return (
    response &&
    response?.OfferListResponse.OfferID?.map((offer) =>
      offer.TermsAndConditionsFull.flatMap((terms) =>
        terms.BaggageAllowance.map((baggage) => ({
          productRef: baggage.ProductRef,
          baggageType: baggage.baggageType,
          quantity:
            baggage.BaggageItem &&
            baggage.BaggageItem[0] &&
            baggage.BaggageItem[0].quantity,
          weight:
            baggage.BaggageItem &&
            baggage.BaggageItem[0] &&
            baggage.BaggageItem[0].Measurement &&
            baggage.BaggageItem[0].Measurement[0] &&
            baggage.BaggageItem[0].Measurement[0].value,
          weightUnit:
            baggage.BaggageItem &&
            baggage.BaggageItem[0] &&
            baggage.BaggageItem[0].Measurement &&
            baggage.BaggageItem[0].Measurement[0] &&
            baggage.BaggageItem[0].Measurement[0].unit,
        }))
      )
    )
  );
}
export function extractAllDetails(response) {
  const flightSegments = extractFlightSegments(response);
  const priceDetails = extractPriceDetails(response);
  const baggageAllowance = extractBaggageAllowance(response);

  return {
    flightSegments,
    priceDetails,
    baggageAllowance,
  };
}
