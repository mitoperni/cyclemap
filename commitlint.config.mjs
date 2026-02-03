const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Formatting (no code changes)
        'refactor', // Code refactoring
        'perf', // Performance improvement
        'test', // Tests
        'build', // Build/dependencies changes
        'ci', // CI changes
        'chore', // Maintenance tasks
        'revert', // Revert commit
      ],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 72],
  },
};

export default config;
