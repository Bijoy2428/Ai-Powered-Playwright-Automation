export const searchData = {
  validKeywords: ['laptop', 'mouse', 'headphone'],
  sortKeyword: 'mouse',
  gibberishKeyword: 'zqxjvkwplmnb987',
} as const;

export const loginData = {
  // Dummy values used only for negative / form-level checks — never real credentials.
  invalidUser: { username: '01700000000', password: 'WrongPass#123' },
} as const;
