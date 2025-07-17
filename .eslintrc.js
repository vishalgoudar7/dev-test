module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Disable console warnings in production
    'no-console': 'off',
    // Allow unused variables (already fixed most, but this provides backup)
    'no-unused-vars': 'warn',
    // Allow missing dependencies in useEffect
    'react-hooks/exhaustive-deps': 'warn',
    // Allow anonymous default exports
    'import/no-anonymous-default-export': 'off'
  }
};
