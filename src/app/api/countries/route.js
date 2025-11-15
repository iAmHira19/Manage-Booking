import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // You can replace this with your actual API call or database query
    const countries = [
      { code: 'PK', name: 'Pakistan', phone: '+92' },
      { code: 'US', name: 'United States', phone: '+1' },
      { code: 'GB', name: 'United Kingdom', phone: '+44' },
      { code: 'AE', name: 'United Arab Emirates', phone: '+971' },
      { code: 'SA', name: 'Saudi Arabia', phone: '+966' },
      { code: 'CA', name: 'Canada', phone: '+1' },
      { code: 'AU', name: 'Australia', phone: '+61' },
      { code: 'DE', 'name': 'Germany', phone: '+49' },
      { code: 'FR', 'name': 'France', phone: '+33' },
      { code: 'IT', 'name': 'Italy', phone: '+39' },
      // Add more countries as needed
    ];

    return NextResponse.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
