// const buildFor = process.env.BUILD_FOR ?? "main-page";
const buildFor = process.env.BUILD_FOR ?? 'development';

const content = {
  'main-page': [
    "./index.html",
    "./src/chat-content/**/*.{js,ts,jsx,tsx}",
  ],
  'boot-script': [
    "./src/boot-script/**/*.{js,ts,jsx,tsx}",
  ]
}
content['development'] = content['main-page'].concat(content['boot-script'])

/** @type {import('tailwindcss').Config} */
export default {
  content: content[buildFor],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0057FF",
        },
        black: {
          DEFAULT: "rgba(0,0,0)",
          100: "rgba(255, 255, 255, 0.7)",
          200: "rgba(0, 0, 0, 0.08)"
        },
        gray: {
          200: "rgb(115, 115, 118)",
          300: "rgb(242, 242, 242)",
        },
      },
      boxShadow: {
        wrapper: "rgba(0, 0, 0, 0.16) 0px 5px 40px",
      },

      spacing: {
        "height-header": "64px",
        "avatar-container-width": "45px"
      },
    },
  },
  plugins: [],
};

