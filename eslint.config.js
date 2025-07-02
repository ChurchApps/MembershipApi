const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn', 
        { 
          argsIgnorePattern: '^_|^req$|^res$|^au$|^ex$|^e$|^bind$',
          varsIgnorePattern: '^_|^start$|^result$|^app$',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      
      // General rules
      'no-console': 'error',
      'prefer-const': 'error',
      
      // Code style (enforced by Prettier, but useful for linting)
      'semi': ['error', 'always'],
      'quotes': ['error', 'double'],
      'comma-dangle': ['error', 'never']
    }
  }
];