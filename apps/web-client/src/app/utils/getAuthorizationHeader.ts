export const getAuthorizationHeader = (): string | undefined => {
  const tokenValue = localStorage.getItem('token');

  if (tokenValue) {
    return `Bearer ${tokenValue || ''}`;
  }

  return undefined;
};
