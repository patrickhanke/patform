const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        "eslint:recommended",
        "prettier",
        require.resolve("@vercel/style-guide/eslint/next"),
        require.resolve('@vercel/style-guide/eslint/node'),
        require.resolve('@vercel/style-guide/eslint/typescript'),
        require.resolve('@vercel/style-guide/eslint/browser'),
        require.resolve('@vercel/style-guide/eslint/react'),
        require.resolve('@vercel/style-guide/eslint/next'),
        "plugin:react/recommended",
        'plugin:@typescript-eslint/recommended',
        'turbo',
    ],
    globals: {
        React: true,
        JSX: true,
    },
    env: {
        node: true,
        browser: true,
    },
    plugins: ["only-warn", "react", '@typescript-eslint'],
    settings: {
        "import/resolver": {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: [
        // Ignore dotfiles
        ".*.js",
        "node_modules/",
    ],
    overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
    rules: {
        'import/no-named-as-default': 0,
        'import/no-named-as-default-member': 0,
        'no-console': 1,
        'react/jsx-indent-props': ['error', 'tab'],
        'react/jsx-max-props-per-line': [2, { maximum: { single: 3, multi: 1 } }],
        'react/jsx-closing-bracket-location': [2, 'tag-aligned'],
        'react/jsx-first-prop-new-line':  ['error', 'multiline-multiprop'],	
        'comma-dangle': ['error', {
            'arrays': 'never',
            'objects': 'never',
            'imports': 'never',
            'exports': 'never',
            'functions': 'never'
        }],
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'indent': [
            'error',
            'tab'
        ],
        'linebreak-style': [
            'error',
            'windows'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};
