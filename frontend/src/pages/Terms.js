import React from 'react';

const Terms = () => {
  const sections = [
    {
      title: '1. Eligibility',
      items: [
        'Renter must be at least 18 years old',
        'Valid driving license is mandatory',
        'Original ID proof required at the time of pickup',
        'International customers require valid passport and International Driving Permit',
      ]
    },
    {
      title: '2. Booking & Payment',
      items: [
        'Full payment required at the time of booking confirmation',
        'Security deposit may be applicable (refundable)',
        'Cancellation 24 hours before pickup: Full refund',
        'Cancellation within 24 hours: 50% refund',
        'No-show: No refund',
      ]
    },
    {
      title: '3. Rental Period',
      items: [
        'Minimum rental period: 1 day (24 hours)',
        'Late returns may incur additional charges',
        'Extension requests must be made in advance',
        'Rental day calculation: 24-hour periods from pickup time',
      ]
    },
    {
      title: '4. Bike Usage',
      items: [
        'Bike must be used only within designated areas',
        'Off-road usage is strictly prohibited',
        'No smoking or alcohol consumption while riding',
        'Helmets must be worn at all times',
        'Follow all traffic rules and regulations',
      ]
    },
    {
      title: '5. Insurance & Liability',
      items: [
        'Comprehensive insurance included in rental cost',
        'Renter liable for damages due to negligence',
        'Insurance excess applicable in case of accidents',
        'Theft protection with proper documentation',
      ]
    },
    {
      title: '6. Prohibited Activities',
      items: [
        'Racing or stunt riding',
        'Carrying more than designated passengers',
        'Using bike for commercial purposes',
        'Modifying the bike in any way',
        'Transporting illegal substances',
      ]
    },
  ];

  return (
    <div>
      <div className="section-title">
        <h2>Terms & Conditions</h2>
        <p>Please read our rental agreement terms carefully before booking</p>
      </div>

      <div className="card">
        <div className="card-body" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {sections.map((section, i) => (
            <div key={i} style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                {section.title}
              </h4>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {section.items.map((item, j) => (
                  <li key={j} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="alert alert--warning" style={{ marginTop: '2rem' }}>
            <h4>⚠️ Important Notice</h4>
            <p>By proceeding with the booking, you acknowledge that you have read, understood, and agree to abide by all the terms and conditions mentioned above. Violation of any terms may result in additional charges and legal action.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;