const coolierStyles = {
  "prussian-blue": "hsla(208, 57%, 21%, 1)",
  "carolina-blue": "hsla(205, 60%, 64%, 1)",
  "celestial-blue": "hsla(204, 69%, 50%, 1)",
  charcoal: "hsla(197, 51%, 22%, 1)",
  "bice-blue": "hsla(203, 70%, 37%, 1)",
} as const;

export const theme = {
  colors: {
    main: {
      primary: coolierStyles["celestial-blue"],
      secondary: coolierStyles["carolina-blue"],
      tertiary: coolierStyles["bice-blue"],
    },
    background: {
      primary: coolierStyles["prussian-blue"],
      secondary: coolierStyles["charcoal"],
    },
    text: {
      primary: "white",
    },
    common: {
      white: "white",
      black: "black",
    },
  },
} as const;
export type Theme = typeof theme;
