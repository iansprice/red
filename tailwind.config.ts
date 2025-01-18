module.exports = {
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        'dune': {
          50: 'hsl(20 40% 97% / <alpha-value>)',   // Lightest sand
          100: 'hsl(20 35% 91% / <alpha-value>)',  // Light sand highlight
          200: 'hsl(20 30% 85% / <alpha-value>)',  // Soft sand
          300: 'hsl(20 35% 74% / <alpha-value>)',  // Weathered sandstone
          400: 'hsl(20 40% 63% / <alpha-value>)',  // Aged terra-cotta
          500: 'hsl(20 45% 52% / <alpha-value>)',  // Deep sand shadow
          600: 'hsl(20 50% 41% / <alpha-value>)',  // Rich earth
          700: 'hsl(20 55% 32% / <alpha-value>)',  // Shadow depths
          800: 'hsl(20 60% 24% / <alpha-value>)',  // Deep canyon shadow
          900: 'hsl(20 65% 18% / <alpha-value>)',  // Darkest canyon
        },
        'sage': {
          50: 'hsl(100 15% 96% / <alpha-value>)',  // Desert morning
          100: 'hsl(100 15% 92% / <alpha-value>)', // Light sage frost
          200: 'hsl(100 20% 83% / <alpha-value>)', // Desert brush
          300: 'hsl(100 20% 72% / <alpha-value>)', // Dried sage
          400: 'hsl(100 25% 61% / <alpha-value>)', // Desert plant
          500: 'hsl(100 25% 48% / <alpha-value>)', // Muted sage
          600: 'hsl(100 30% 38% / <alpha-value>)', // Shadow sage
          700: 'hsl(100 30% 29% / <alpha-value>)', // Deep sage
          800: 'hsl(100 30% 22% / <alpha-value>)', // Night sage
          900: 'hsl(100 30% 15% / <alpha-value>)', // Darkest sage
        },
        'twilight': {
          50: 'hsl(280 15% 96% / <alpha-value>)',  // Dusk light
          100: 'hsl(280 15% 91% / <alpha-value>)', // Soft twilight
          200: 'hsl(280 20% 83% / <alpha-value>)', // Evening haze
          300: 'hsl(280 25% 71% / <alpha-value>)', // Desert sunset purple
          400: 'hsl(280 30% 59% / <alpha-value>)', // Fading light
          500: 'hsl(280 35% 47% / <alpha-value>)', // Deep dusk
          600: 'hsl(280 40% 37% / <alpha-value>)', // Shadow purple
          700: 'hsl(280 45% 28% / <alpha-value>)', // Night falling
          800: 'hsl(280 45% 20% / <alpha-value>)', // Deep night
          900: 'hsl(280 45% 15% / <alpha-value>)', // Midnight desert
        },
        'horizon': {
          50: 'hsl(10 70% 97% / <alpha-value>)',   // Dawn light
          100: 'hsl(10 75% 94% / <alpha-value>)',  // Morning glow
          200: 'hsl(10 80% 85% / <alpha-value>)',  // Sunset reflection
          300: 'hsl(10 85% 76% / <alpha-value>)',  // Desert rose
          400: 'hsl(10 90% 66% / <alpha-value>)',  // Fading sun
          500: 'hsl(10 95% 56% / <alpha-value>)',  // Desert heat
          600: 'hsl(10 95% 44% / <alpha-value>)',  // Deep sunset
          700: 'hsl(10 95% 34% / <alpha-value>)',  // Shadow sunset
          800: 'hsl(10 95% 26% / <alpha-value>)',  // Night approaching
          900: 'hsl(10 95% 20% / <alpha-value>)',  // Deep night red
        },
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
      // Border radius that feels more architectural
      borderRadius: {
        'subtle': '0.125rem',
        'architectural': '0.1875rem',
      },
      // Shadows that feel more natural and less artificial
      boxShadow: {
        'desert': '0 1px 3px rgba(86, 52, 38, 0.05), 0 1px 2px rgba(86, 52, 38, 0.1)',
        'dune': '0 4px 6px rgba(86, 52, 38, 0.05), 0 2px 4px rgba(86, 52, 38, 0.08)',
        'oasis': '0 10px 15px rgba(86, 52, 38, 0.03), 0 4px 6px rgba(86, 52, 38, 0.05)',
        'mirage': '0 20px 25px rgba(86, 52, 38, 0.02), 0 8px 10px rgba(86, 52, 38, 0.04)',
      },
      // Font families that feel timeless yet modern
      fontFamily: {
        'sans': ['Spectral', 'system-ui', 'sans-serif'],
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
        'tall': { 'raw': '(min-height: 800px)' },
        'ultra': '2000px',
      },
    }
  }
}