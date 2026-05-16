import { useState } from 'react';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { legalAidData } from '../../data/legalAid';

const TEAL = '#1d9e75';

export default function LegalAidFinder() {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const result = legalAidData.find(d => d.district === selectedDistrict);

  return (
    <PageWrapper style={{ minHeight: '100vh', background: '#08120f', color: '#d8ede6' }}>
      <Navbar theme="green" showBack={true} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 2.5rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
          color: 'rgba(29,158,117,0.7)', marginBottom: '0.3rem' }}>Karnataka DLSA</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
          fontWeight: 700, color: '#d8ede6', marginBottom: '0.4rem' }}>Find Free Legal Aid</h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(216,237,230,0.45)', fontWeight: 300,
          marginBottom: '2rem', lineHeight: 1.6 }}>
          Every Indian citizen has the right to free legal aid under Article 39A.
          Select your district to find your nearest District Legal Services Authority.
        </p>

        <div style={{ padding: '1rem 1.4rem', background: 'rgba(29,158,117,0.07)',
          border: '1px solid rgba(29,158,117,0.2)', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: 1, textTransform: 'uppercase',
              color: 'rgba(29,158,117,0.6)', marginBottom: 3 }}>National Legal Aid Helpline</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(216,237,230,0.6)' }}>
              Call from anywhere in India — free legal advice in your language
            </div>
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
            fontWeight: 700, color: TEAL }}>15100</div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase',
            color: 'rgba(29,158,117,0.6)', marginBottom: '0.6rem' }}>Select Your District</div>
          <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}
            style={{ width: '100%', padding: '0.85rem 1.2rem',
              background: 'rgba(29,158,117,0.06)',
              border: '1px solid rgba(29,158,117,0.22)', borderRadius: 10,
              color: selectedDistrict ? '#d8ede6' : 'rgba(216,237,230,0.35)',
              fontSize: '0.9rem', fontFamily: "'Outfit',sans-serif",
              outline: 'none', cursor: 'pointer' }}>
            <option value="">— Choose a district —</option>
            {legalAidData.map((d, i) => (
              <option key={i} value={d.district} style={{ background: '#0d2b24' }}>{d.district}</option>
            ))}
          </select>
        </div>

        {result && (
          <div style={{ background: 'rgba(29,158,117,0.04)',
            border: '1px solid rgba(29,158,117,0.18)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '1.4rem 1.8rem', borderBottom: '1px solid rgba(29,158,117,0.1)',
              background: 'rgba(29,158,117,0.07)' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem',
                fontWeight: 700, color: '#d8ede6', marginBottom: '0.2rem' }}>{result.dlsa_name}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(216,237,230,0.5)' }}>
                Secretary: {result.secretary}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: 0 }}>
              {[
                { icon: '📍', label: 'Address', value: result.address },
                { icon: '🕐', label: 'Office Hours', value: result.timings },
                { icon: '📞', label: 'Direct Phone', value: result.phone },
                { icon: '📧', label: 'Email', value: result.email },
              ].map((item, i) => (
                <div key={i} style={{ padding: '1rem 1.8rem',
                  borderBottom: '1px solid rgba(29,158,117,0.07)',
                  borderRight: i % 2 === 0 ? '1px solid rgba(29,158,117,0.07)' : 'none' }}>
                  <div style={{ fontSize: '0.67rem', letterSpacing: '1.5px',
                    textTransform: 'uppercase', color: 'rgba(216,237,230,0.35)',
                    marginBottom: '0.3rem' }}>{item.icon} {item.label}</div>
                  <div style={{ fontSize: '0.85rem', color: '#d8ede6', lineHeight: 1.5 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '1.2rem 1.8rem', borderTop: '1px solid rgba(29,158,117,0.07)' }}>
              <div style={{ fontSize: '0.67rem', letterSpacing: '1.5px',
                textTransform: 'uppercase', color: 'rgba(216,237,230,0.35)',
                marginBottom: '0.8rem' }}>Services Available</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {result.services.map((s, i) => (
                  <span key={i} style={{ fontSize: '0.78rem', padding: '4px 12px',
                    background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.2)',
                    borderRadius: 20, color: 'rgba(216,237,230,0.7)' }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ padding: '1rem 1.8rem', background: 'rgba(29,158,117,0.06)',
              borderTop: '1px solid rgba(29,158,117,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(216,237,230,0.5)' }}>
                National Toll-Free Legal Aid Helpline
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif",
                fontSize: '1.5rem', fontWeight: 700, color: TEAL }}>15100</div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', padding: '1.2rem 1.8rem',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#d8ede6',
            marginBottom: '0.8rem' }}>Who is eligible for free legal aid?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[
              'Annual income below ₹1 lakh (₹2 lakh in some states)',
              'SC/ST community members',
              'Women and children in any case',
              'Victims of trafficking or natural disaster',
              'Persons with disabilities',
              'Industrial workmen',
              'Persons in custody (undertrials)',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8,
                fontSize: '0.8rem', color: 'rgba(216,237,230,0.5)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%',
                  background: TEAL, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}