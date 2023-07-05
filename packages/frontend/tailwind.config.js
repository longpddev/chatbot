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
console.log('------' + buildFor + "-------")
content['development'] = content['main-page'].concat(content['boot-script'])

/** @type {import('tailwindcss').Config} */
export default {
  content: content[buildFor],
  theme: {
    extend: {},
  },
  plugins: [],
}

