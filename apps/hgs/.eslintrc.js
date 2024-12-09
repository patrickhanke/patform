// eslint-disable-next-line no-undef
module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended'
	],
	'overrides': [
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'plugins': [
		'react',
		'@typescript-eslint'
	],
	'rules': {
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
