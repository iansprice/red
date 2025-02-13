import animate from "tailwindcss-animate";
import {setupInspiraUI} from "@inspira-ui/plugins";

export default {
    darkMode: 'selector',
    safelist: ["dark"],
    prefix: "",
    content: [],
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                xl: "calc(var(--radius) + 4px)",
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                subtle: '0.125rem',
                architectural: '0.1875rem',
            },
            // Rest of the config remains the same...
            // Custom spacing for more architectural layouts
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '30': '7.5rem',
                '34': '8.5rem',
                '68': '17rem',
                '100': '25rem',
                '120': '30rem',
            },
            // Font families that feel timeless yet modern
            fontFamily: {
                'sans': ['IBM Plex Mono', 'monospace'],
                // 'sans': ['Spectral', 'system-ui', 'sans-serif'],
                'display': ['Cormorant', 'Georgia', 'serif'],
                'mono': ['IBM Plex Mono', 'monospace'],
            },
            // Custom line heights for better typography
            lineHeight: {
                'relaxed': '1.75',
                'spacious': '2',
            },
            // Break points that better support modern devices
            screens: {
                'xs': '480px',
                'tall': {'raw': '(min-height: 800px)'},
                'ultra': '2000px',
            },
        }
    },
    plugins: [
        animate,
        setupInspiraUI,
        function ({addComponents}) {
            addComponents({
                '@screen md': {
                    '.min-w-prose': {
                        minWidth: '65ch'
                    }
                }
            })
        },
    ],
}