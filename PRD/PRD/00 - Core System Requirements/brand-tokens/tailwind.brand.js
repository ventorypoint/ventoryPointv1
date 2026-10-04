// Tailwind preset — brand tokens (reference: rillet.com, adapted). Usage: presets: [require("./tailwind.brand.js")]
module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "purple": {
          "50": "#EBEEFF",
          "100": "#DBDFFF",
          "200": "#BFC4FF",
          "300": "#989CFF",
          "400": "#766FFF",
          "500": "#644EFF",
          "600": "#582EFD",
          "700": "#4C22E0",
          "800": "#392498",
          "900": "#211452"
        },
        "violet": {
          "50": "#F3F2F6",
          "100": "#F3F2F6",
          "200": "#E1DCED",
          "300": "#C9C0EB",
          "400": "#A694DC",
          "500": "#876BC5",
          "600": "#62478D",
          "700": "#402F76",
          "800": "#240257",
          "900": "#15052B"
        },
        "gray": {
          "50": "#FAFAFA",
          "100": "#F4F4F5",
          "200": "#E4E4E7",
          "300": "#D4D4D8",
          "400": "#A1A1AA",
          "500": "#71717A",
          "600": "#52525B",
          "700": "#3F3F46",
          "800": "#27272A",
          "900": "#18181B"
        },
        "green": {
          "50": "#EBF5EC",
          "100": "#CEF0D1",
          "200": "#A4DFAA",
          "300": "#7BD794",
          "400": "#49C47C",
          "500": "#39BB7C",
          "600": "#2AA666",
          "700": "#1F996C",
          "800": "#0D895C",
          "900": "#005133"
        },
        "amber": {
          "50": "#F8EFDE",
          "100": "#FCF0DA",
          "200": "#F5DFB9",
          "300": "#E8CA87",
          "400": "#DFBD71",
          "500": "#DDB04D",
          "600": "#CA8A04",
          "700": "#A16207",
          "800": "#854D0E",
          "900": "#713F12"
        },
        "red": {
          "50": "#FEF2F2",
          "600": "#DC2626",
          "700": "#B91C1C"
        },
        "brand": "#582EFD",
        "success": "#1F996C",
        "warning": "#CA8A04",
        "danger": "#DC2626",
        "success-text": "#005133",
        "warning-text": "#854D0E",
        "danger-text": "#B91C1C"
      },
      "fontFamily": {
        "heading": [
          "Space Grotesk",
          "system-ui",
          "sans-serif"
        ],
        "sans": [
          "DM Sans",
          "system-ui",
          "sans-serif"
        ],
        "mono": [
          "JetBrains Mono",
          "ui-monospace",
          "monospace"
        ]
      },
      "borderRadius": {
        "control": "6px",
        "card": "12px",
        "panel": "16px"
      },
      "boxShadow": {
        "float": "0 24px 48px -12px rgba(17,17,20,0.18)",
        "glow": "0 3px 80px rgba(76,34,224,0.2)"
      },
      "backgroundImage": {
        "dark-purple": "linear-gradient(180deg, #211452, #392498)",
        "dark-violet": "linear-gradient(180deg, #15052B, #240257)",
        "light-purple": "linear-gradient(180deg, #DBDFFF, #EBEEFF)"
      },
      "maxWidth": {
        "container-sm": "1210px",
        "container-md": "1330px",
        "container-lg": "1440px"
      }
    }
  }
};
