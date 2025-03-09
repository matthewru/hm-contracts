export const useNavigate = () => {
  const getOrigin = () => {
    return typeof window !== 'undefined' ? window.location.origin : '';
  };

  return {
    getOrigin
  };
}; 