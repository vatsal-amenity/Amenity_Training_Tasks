/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'indigo-dye': '#1B2A4E',    // Deep Indigo (Primary Accent)
                'warm-cream': '#F9F7F2',    // Off-White/Paper (Background)
                'terracotta': '#D99478',    // Muted Terracotta (Secondary)
                'ocher': '#C5A059',         // Muted Ocher (Accent)
                'charcoal': '#2C2C2C',      // Dark Charcoal (Text)
                'soft-gray': '#E5E5E5',     // Subtle Borders
            },
            fontFamily: {
                'serif': ['"Playfair Display"', 'serif'], // Elegant for Headings
                'sans': ['"Outfit"', 'sans-serif'],       // Clean for Inputs/Buttons
            },
            backgroundImage: {
                // Optional: distinctive textures if you have them, otherwise use colors
                'paper-texture': "url('https://www.transparenttextures.com/patterns/cream-paper.png')", // Example texture
            }
        },
    },
    plugins: [],
}