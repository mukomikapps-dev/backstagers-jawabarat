export function getStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Backstagers DPD Jawa Barat",
    "description": "Organisasi profesional yang menyediakan layanan event management, entertainment, dan produksi",
    "url": "https://backstagers-jawabarat.vercel.app",
    "logo": "https://backstagers-jawabarat.vercel.app/logo_backstagers_jawabarat.png",
    "sameAs": [
      "https://instagram.com/backstagers",
      "https://facebook.com/backstagers",
      "https://twitter.com/backstagers"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "contact@backstagers.com",
      "telephone": "+62-XXX-XXXX-XXXX"
    },
    "areaServed": {
      "@type": "State",
      "name": "Jawa Barat"
    },
    "knowsAbout": [
      "Event Management",
      "Entertainment",
      "Produksi",
      "Sound System",
      "Lighting",
      "Dekorasi",
      "Talent Management"
    ]
  };
}
