module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Parses TypeScript code
  parserOptions: {
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'import',
    'unused-imports',
    '@nestjs',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended', // TypeScript rules
    'plugin:@nestjs/recommended',            // NestJS best practices
    'plugin:prettier/recommended',           // Prettier + ESLint integration
  ],
  rules: {
    // Prettier integration
    'prettier/prettier': ['error', { singleQuote: true, printWidth: 100 }],

    // Disallow unused imports
    'unused-imports/no-unused-imports': 'error',

    // TypeScript strictness
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',

    // Clean imports
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], ['internal']],
        'newlines-between': 'always',
      },
    ],
  },
  ignorePatterns: ['dist', 'node_modules'],
};
