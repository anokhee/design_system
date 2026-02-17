// Typography classes you want rendered
window.DS_DATA = {
  typeStyles: [
    "text-display-lg",
    "text-display-md",
    "text-display-sm",
    "text-headline-lg",
    "text-headline-lg-bold",
    "text-headline-md",
    "text-headline-md-bold",
    "text-headline-sm",
    "text-headline-sm-bold",
    "text-title-lg",
    "text-title-lg-bold",
    "text-body-md",
  ],

  colorGroups: {
    Neutral: {
      "neutral-white": "#ffffff",
      "neutral-very-light": "#F3F4F7",
      "neutral-light": "#DADEE8",
      "neutral-medium": "#7884A5",
      "neutral-dark": "#525C7A",
      "neutral-very-dark": "#313749",
      "neutral-black": "#101218",
    },
    Primary: {
      "primary-lightest": "#010100",
      "primary-very-light": "#010100",
      "primary-super-light": "#010100",
      "primary-light": "#010100",
      "primary-medium": "#010100",
      "primary-dark": "#010100",
      "primary-very-dark": "#010100",
      "primary-darkest": "#16173C",
    },
    Green: {
      "green-lightest": "#EFFBF1",
      "green-very-light": "#BFEDC6",
      "green-light": "#7FDC8D",
      "green-medium": "#3FCA54",
      "green-dark": "#2CA03D",
      "green-very-dark": "#1A6025",
      "green-darkest": "#0D3012",
    },
    Yellow: {
      "yellow-lightest": "#FFF9EB",
      "yellow-very-light": "#FFEDC2",
      "yellow-light": "#FFD770",
      "yellow-medium": "#FFC533",
      "yellow-dark": "#E0A100",
      "yellow-very-dark": "#B88400",
      "yellow-darkest": "#6B4D01",
    },
    Red: {
      "red-lightest": "#FDEDF1",
      "red-very-light": "#F7B6C7",
      "red-light": "#ED5A81",
      "red-medium": "#E5245B",
      "red-dark": "#A4133C",
      "red-very-dark": "#6E0D28",
      "red-darkest": "#370613",
    },
    Assorted: {
      "dark-blue": "#0F172A",
      "off-white": "#f9fafb",
      "disabled-field": "#f8fafc",
      "light-gray": "#FAFAFA",
      "gray-tag": "#dfe0e2",
    },
  },

  conversations: [
    {
      name: "Poppyseed the Chicken",
      avatar: "PC",
      phone: "(555) 123-4567",
      messages: [
        {
          type: "outgoing",
          text: "Hi Hubert, Grayscale here! We love your resume and would love to schedule time for a phone screen.",
        },
        {
          type: "incoming",
          text: "Sounds good! I'll find a time. Chat soon",
        },
      ],
    },
    {
      name: "Woolvolio the Sheep",
      avatar: "WS",
      phone: "(555) 987-6543",
      messages: [
        { type: "incoming", text: "System Message: Reengagement work..." },
      ],
    },
    {
      name: "Milkita the Cow",
      avatar: "MC",
      phone: "(555) 555-1212",
      messages: [
        { type: "incoming", text: "Woohoo! Looking forward to it! -Les" },
      ],
    },
  ],
};
