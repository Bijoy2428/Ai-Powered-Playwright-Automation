export const searchData = {
  validKeywords: ['laptop', 'mouse', 'headphone'],
  sortKeyword: 'mouse',
  gibberishKeyword: 'zqxjvkwplmnb987',
} as const;

// Dummy values used only for negative / form-level checks — never real credentials.
export const loginData = {
  invalidUser: { username: '01700000000', password: 'WrongPass#123' },
  /** Each case leaves exactly one field empty and expects only that field's error. */
  missingField: [
    {
      case: 'password is empty',
      username: '01700000000',
      password: '',
      errorOn: 'password',
      okOn: 'username',
    },
    {
      case: 'phone/email is empty',
      username: '',
      password: 'WrongPass#123',
      errorOn: 'username',
      okOn: 'password',
    },
  ],
} as const;
