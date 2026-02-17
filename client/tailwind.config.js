/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg0: 'var(--bg0)',
                bg1: 'var(--bg1)',
                card: 'var(--card)',
                cardBorder: 'var(--cardBorder)',
                text: 'var(--text)',
                muted: 'var(--muted)',
                accent: 'var(--accent)',
                accent2: 'var(--accent2)',
                danger: 'var(--danger)',
                success: 'var(--success)',
                warning: '#f97316', // Orange-500 equivalent for medium risk
            },
            borderRadius: {
                lg: 'var(--radius-lg)',
                md: 'var(--radius-md)',
                sm: 'var(--radius-sm)',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
