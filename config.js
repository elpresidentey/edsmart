// Global configuration for EdSmart
// Replace values below for your deployment

// Hosted contact form endpoint (e.g., Formspree, Netlify Forms handler)
window.EDS_FORM_ENDPOINT = "https://formspree.io/f/your_id"; // TODO: replace with your real endpoint

// Analytics toggle (respects consent banner)
window.EDS_ANALYTICS_ENABLED = true; // set to false to disable analytics entirely

// Optional: load an analytics provider script AFTER consent
// Example for Plausible (replace domain with your real domain)
window.EDS_ANALYTICS_PROVIDER_URL = "https://plausible.io/js/script.js"; // or "https://umami.yourdomain.com/script.js"
window.EDS_ANALYTICS_PROVIDER_ATTRS = {
  "data-domain": "elpresidentey.github.io"
  // Add provider-specific attributes if needed
};

