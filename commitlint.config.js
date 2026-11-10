export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 72],
    'scope-enum': [
      2,
      'always',
      ['api', 'web', 'db', 'tooling', 'docker', 'docs', 'test', 'deps'],
    ],
  },
};
