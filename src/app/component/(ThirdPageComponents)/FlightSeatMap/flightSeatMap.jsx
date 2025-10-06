import React, { useState } from "react";

const SeatGrid = () => {
  const jsonData = {
    CatalogOfferingsAncillaryListResponse: {
      "@type": "CatalogOfferingsAncillaryListResponse",
      transactionId: "72e79c69-f55d-564a-c2f8-0e8a2d16ac35",
      CatalogOfferingsID: [
        {
          "@type": "CatalogOfferingsTravelerFlight",
          id: "travflight_1_0",
          Identifier: {
            value: "43b4fda6-5b3c-4f5d-981b-c43121f27978",
          },
          CatalogOffering: [
            {
              "@type": "CatalogOffering",
              id: "ancillaryID_1_0_1",
              Identifier: {
                authority: "Travelport",
                value: "6fd4aa88-94c5-4375-b05a-a9d992216b55",
              },
              ProductOptions: [
                {
                  "@type": "ProductOptions",
                  Product: [
                    {
                      "@type": "ProductSeatAvailability",
                      id: "productSeatID_1",
                      SeatAvailability: [
                        {
                          seatAvailabilityStatus: "Available",
                          value: [
                            "15A",
                            "15B",
                            "15C",
                            "15D",
                            "15E",
                            "15F",
                            "16A",
                            "16B",
                            "16C",
                            "16D",
                            "16E",
                            "16F",
                            "17A",
                            "17B",
                            "17C",
                            "17D",
                            "17E",
                            "17F",
                            "18C",
                            "18D",
                            "18E",
                            "18F",
                            "19A",
                            "19B",
                            "19C",
                            "19D",
                            "19E",
                            "19F",
                            "20C",
                            "20D",
                            "20E",
                            "20F",
                            "22A",
                            "22B",
                            "22C",
                            "25A",
                            "25B",
                            "25C",
                            "25D",
                            "25E",
                            "25F",
                            "26A",
                            "26B",
                            "26C",
                            "26D",
                            "26E",
                            "26F",
                            "27A",
                            "27B",
                            "27C",
                            "27D",
                            "27E",
                            "27F",
                          ],
                        },
                        {
                          seatAvailabilityStatus: "Reserved",
                          value: [
                            "4A",
                            "4B",
                            "4C",
                            "4D",
                            "4E",
                            "4F",
                            "5A",
                            "5B",
                            "5C",
                            "5D",
                            "5E",
                            "5F",
                            "6A",
                            "6B",
                            "6C",
                            "6D",
                            "6E",
                            "6F",
                            "7A",
                            "7B",
                            "7C",
                            "7D",
                            "7E",
                            "7F",
                            "8A",
                            "8B",
                            "8C",
                            "8D",
                            "8E",
                            "8F",
                            "10A",
                            "10B",
                            "10C",
                            "10D",
                            "10E",
                            "10F",
                            "11A",
                            "11B",
                            "11C",
                            "11D",
                            "11E",
                            "11F",
                            "12A",
                            "12B",
                            "12C",
                            "12D",
                            "12E",
                            "12F",
                            "18A",
                            "18B",
                            "20A",
                            "20B",
                            "21A",
                            "21B",
                            "21C",
                            "21D",
                            "21E",
                            "21F",
                            "22D",
                            "22E",
                            "22F",
                            "23A",
                            "23B",
                            "23C",
                            "23D",
                            "23E",
                            "23F",
                            "24A",
                            "24B",
                            "24C",
                            "24D",
                            "24E",
                            "24F",
                            "29A",
                            "29B",
                            "29C",
                            "29D",
                            "29E",
                            "29F",
                            "30A",
                            "30B",
                            "30C",
                            "30D",
                            "30E",
                            "30F",
                          ],
                        },
                      ],
                      Brand: {
                        "@type": "Brand",
                        name: "SEAT ASSIGNMENT",
                      },
                      SeatingChartRef: "seatingChart_1",
                    },
                  ],
                },
              ],
              Price: {
                "@type": "PriceDetail",
                CurrencyCode: {
                  decimalPlace: 2,
                  value: "AUD",
                },
                Base: 0,
                TotalPrice: 0,
              },
            },
            {
              "@type": "CatalogOffering",
              id: "ancillaryID_1_0_2",
              Identifier: {
                authority: "Travelport",
                value: "7cabe058-1c65-4011-ab16-221adef7fdb9",
              },
              ProductOptions: [
                {
                  "@type": "ProductOptions",
                  Product: [
                    {
                      "@type": "ProductSeatAvailability",
                      id: "productSeatID_2",
                      SeatAvailability: [
                        {
                          seatAvailabilityStatus: "Available",
                          value: ["9A", "9B", "9C", "9E", "9F"],
                        },
                      ],
                      Brand: {
                        "@type": "Brand",
                        name: "PREFERRED SEAT",
                      },
                      SeatingChartRef: "seatingChart_1",
                    },
                  ],
                },
              ],
              Price: {
                "@type": "PriceDetail",
                CurrencyCode: {
                  decimalPlace: 2,
                  value: "AUD",
                },
                Base: 8.18,
                TotalTaxes: 0.82,
                TotalPrice: 9,
                PriceBreakdown: [
                  {
                    "@type": "PriceBreakdownAncillaryAir",
                    Amount: {
                      "@type": "Amount",
                      Taxes: {
                        "@type": "TaxesDetail",
                        Tax: [
                          {
                            taxCode: "UO",
                            value: 0.82,
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ],
          TravelerIdentifierRef: [
            {
              passengerTypeCode: "ADT",
            },
          ],
          Flight: [
            {
              "@type": "Flight",
              distance: 456,
              duration: "PT1H35M",
              carrier: "QF",
              number: "0409",
              equipment: "73H",
              id: "s1",
              Departure: {
                "@type": "DepartureDetail",
                terminal: "3",
                location: "SYD",
                date: "2024-09-01",
                time: "07:00:00",
              },
              Arrival: {
                "@type": "ArrivalDetail",
                terminal: "1",
                location: "MEL",
                date: "2024-09-01",
                time: "08:35:00",
              },
            },
          ],
        },
      ],
      Result: {
        "@type": "Result",
      },
      Identifier: {
        value: "05bf30d6-6394-4679-9566-fa0ccd448373",
      },
      ReferenceList: [
        {
          "@type": "ReferenceListSeatingChart",
          SeatingChart: [
            {
              "@type": "SeatingChart",
              id: "seatingChart_1",
              Cabin: [
                {
                  "@type": "Cabin",
                  name: "ECONOMY",
                  Layout: [
                    {
                      startRow: 4,
                      endRow: 30,
                    },
                    {
                      position: ["W"],
                      value: "A",
                    },
                    {
                      position: ["C"],
                      value: "B",
                    },
                    {
                      position: ["A"],
                      value: "C",
                    },
                    {
                      position: ["A"],
                      value: "D",
                    },
                    {
                      position: ["C"],
                      value: "E",
                    },
                    {
                      position: ["W"],
                      value: "F",
                    },
                  ],
                  Row: [
                    {
                      "@type": "Row",
                      label: "4",
                      Space: [
                        {
                          "@type": "Space",
                          location: "A",
                          Characteristic: ["BK"],
                        },
                        {
                          "@type": "Space",
                          location: "B",
                          Characteristic: ["BK"],
                        },
                        {
                          "@type": "Space",
                          location: "C",
                          Characteristic: ["BK"],
                        },
                        {
                          "@type": "Space",
                          location: "D",
                          Characteristic: ["BK"],
                        },
                        {
                          "@type": "Space",
                          location: "E",
                          Characteristic: ["BK"],
                        },
                        {
                          "@type": "Space",
                          location: "F",
                          Characteristic: ["BK"],
                        },
                      ],
                    },
                    {
                      "@type": "Row",
                      label: "5",
                      Space: [
                        {
                          "@type": "Space",
                          location: "A",
                          Characteristic: ["BK"],
                        },
                        {
                          "@type": "Space",
                          location: "B",
                          Characteristic: ["BK"],
                        },
                        {
                          "@type": "Space",
                          location: "C",
                          Characteristic: ["BK"],
                        },
                        {
                          "@type": "Space",
                          location: "D",
                          Characteristic: ["BK"],
                        },
                        {
                          "@type": "Space",
                          location: "E",
                          Characteristic: ["BK"],
                        },
                        {
                          "@type": "Space",
                          location: "F",
                          Characteristic: ["BK"],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };

  const layout =
    jsonData.CatalogOfferingsAncillaryListResponse.ReferenceList[0]
      .SeatingChart[0].Cabin[0].Layout;
  const { startRow, endRow } = layout[0];
  const columns = layout.slice(1);
  const totalRows = endRow - startRow + 1;
  const [selectedBox, setSelectedBox] = useState(null);

  const offerings =
    jsonData.CatalogOfferingsAncillaryListResponse.CatalogOfferingsID[0]
      .CatalogOffering;

  const availableSeats = new Set();
  const reservedSeats = new Set();
  const blockedSeats = new Set();
  const seatPrices = {};

  offerings.forEach((offering) => {
    offering.ProductOptions.forEach((option) => {
      option.Product.forEach((product) => {
        product.SeatAvailability.forEach((seatGroup) => {
          seatGroup.value.forEach((seat) => {
            if (seatGroup.seatAvailabilityStatus === "Available") {
              availableSeats.add(seat);
            } else if (seatGroup.seatAvailabilityStatus === "Reserved") {
              reservedSeats.add(seat);
            }

            if (product.Brand.name === "PREFERRED SEAT") {
              seatPrices[seat] = offering.Price.TotalPrice;
            }
          });
        });
      });
    });
  });

  jsonData.CatalogOfferingsAncillaryListResponse.ReferenceList[0].SeatingChart[0].Cabin[0].Row.forEach(
    (row) => {
      row.Space.forEach((space) => {
        if (space.Characteristic.includes("BK")) {
          blockedSeats.add(`${row.label}${space.location}`);
        }
      });
    }
  );

  const toggleBox = (rowNumber, colVal) => {
    const key = `${rowNumber}${colVal}`;
    if (!reservedSeats.has(key) && !blockedSeats.has(key)) {
      setSelectedBox((prev) => (prev === key ? null : key));
    }
  };

  const getGapClass = (currentIndex) => {
    if (currentIndex === 0) return "";
    return columns[currentIndex].position[0] ===
      columns[currentIndex - 1].position[0]
      ? "ml-10"
      : "";
  };

  return (
    <div className="p-4 w-full">
      <div className="grid grid-cols-[50px_repeat(6,1fr)] gap-1">
        <div></div>
        {columns.map((col, idx) => (
          <div
            key={idx}
            className={`text-center font-bold ${getGapClass(idx)}`}
          >
            {col.value}
          </div>
        ))}

        {Array.from({ length: totalRows }).map((_, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <div className="text-center font-bold mt-10 flex items-center justify-center">
              {startRow + rowIndex}
            </div>
            {columns.map((col, colIndex) => {
              const key = `${startRow + rowIndex}${col.value}`;
              const isSelected = selectedBox === key;
              const isAvailable = availableSeats.has(key);
              const isReserved = reservedSeats.has(key);
              const isBlocked = blockedSeats.has(key);
              const hasPrice = seatPrices[key];

              let seatClass =
                "bg-gray-200 cursor-not-allowed pointer-events-none";
              let tooltipText = `${key} - Not Available`;

              if (isBlocked) {
                seatClass = "bg-gray-500 cursor-not-allowed";
                tooltipText = `${key} - Blocked Seat`;
              } else if (isReserved) {
                seatClass = "bg-red-400 cursor-not-allowed";
                tooltipText = `${key} - Reserved`;
              } else if (isAvailable && hasPrice) {
                seatClass = "bg-yellow-300 hover:bg-yellow-400 cursor-pointer";
                tooltipText = `${key} - Price: $${seatPrices[key]}`;
              } else if (isAvailable) {
                seatClass = "bg-green-300 hover:bg-green-400 cursor-pointer";
                tooltipText = `${key} - Free`;
              }

              return (
                <div
                  key={col.value}
                  className={`group relative w-12 h-12 border flex items-center justify-center 
                    ${
                      isSelected ? "bg-blue-500" : seatClass
                    } mx-auto mt-10 ${getGapClass(colIndex)}`}
                  onClick={() => toggleBox(startRow + rowIndex, col.value)}
                >
                  <span className="absolute hidden group-hover:block bg-black text-white text-xs rounded p-1 -top-8 whitespace-nowrap z-10">
                    {tooltipText}
                  </span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SeatGrid;
