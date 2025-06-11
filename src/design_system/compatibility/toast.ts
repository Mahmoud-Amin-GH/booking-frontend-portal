// Temporary toast functions until we fully integrate 4Sale DS Toast system

export const useSuccessToast = () => {
  return (message: string) => {
    // For now, just use console.log or simple alert
    // TODO: Replace with proper 4Sale DS Toast when integrated
    console.log('SUCCESS:', message);
    // You could also use a simple browser notification or create a custom toast
  };
};

export const useErrorToast = () => {
  return (message: string) => {
    // For now, just use console.error or simple alert
    // TODO: Replace with proper 4Sale DS Toast when integrated
    console.error('ERROR:', message);
    // You could also use a simple browser notification or create a custom toast
  };
};

export const useInfoToast = () => {
  return (message: string) => {
    console.log('INFO:', message);
  };
};

export const useWarningToast = () => {
  return (message: string) => {
    console.warn('WARNING:', message);
  };
}; 