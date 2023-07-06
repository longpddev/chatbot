const mode = process.env.NODE_ENV ?? 'development';

const config = (development, production) => mode === 'development' ? development : production

module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['standard-with-typescript', 'eslint:recommended'],
    plugins: ['preact', '@typescript-eslint'],
    rules: {
        'no-console': config("warn","error"),
        '@typescript-eslint/explicit-function-return-type': 'off',
        "no-unused-vars": config("warn","error"),
        "@typescript-eslint/no-unused-vars": config("warn","error"),
        "@typescript-eslint/strict-boolean-expressions": "off",
        "@typescript-eslint/no-confusing-void-expression": "off",
        "@typescript-eslint/quotes": "off",
        "@typescript-eslint/consistent-type-imports": "off",
        "@typescript-eslint/semi": "off",
        "eol-last": "off",
        "no-return-assign": 'off',
        "no-new": "off"
    },
};
