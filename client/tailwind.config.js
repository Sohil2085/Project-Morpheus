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
            },
            keyframes: {
                scan: {
                    '0%':   { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(1400%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%':      { transform: 'translateY(-8px)' },
                },
                'fade-in': {
                    '0%':   { opacity: '0', transform: 'translateY(6px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                scan:      'scan 2.4s linear infinite',
                float:     'float 4s ease-in-out infinite',
                'fade-in': 'fade-in 0.4s ease-out both',
            },
        },
    },
    plugins: [],
}
