// Toast utility hook simulation
export const useToast = () => ({
  toast: (message: string) => console.log('Toast:', message),
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.log('Error:', message),
}); 