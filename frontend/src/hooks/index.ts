import { useLocation } from 'react-router-dom';

export const useQuery = (param: string) => {
  const { search } = useLocation();
  return new URLSearchParams(search).get(param);
};
