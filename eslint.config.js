const js = require('@eslint/js');
const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = (async () => {
  const stylistic = await import('@stylistic/eslint-plugin');
  
  return [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json'
      },
      globals: {
        Buffer: 'readonly',
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': ts,
      '@stylistic': stylistic.default
    },
    rules: {
      // Core rules
      'no-console': 'error',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // TypeScript handles this
      'prefer-const': 'warn',
      'no-var': 'error',

      // TypeScript specific rules - make less strict for existing codebase
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_|^req$|^res$|^au$|^ex$|^e$|^bind$',
        varsIgnorePattern: '^_|^start$|^result$|^app$',
        caughtErrorsIgnorePattern: '^_'
      }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // Too many existing any types
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'off', // Requires strictNullChecks
      '@typescript-eslint/prefer-optional-chain': 'off',

      // Style rules
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'double'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/eol-last': 'error'
    }
  },
  {
    files: ['tools/**/*.ts', '**/*.spec.ts', '**/*.test.ts'],
    rules: {
      'no-console': 'off' // Allow console in build tools and tests
    }
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'layer/**',
      '*.js' // Ignore JS files like lambda.js for now
    ]
  }
];
})();