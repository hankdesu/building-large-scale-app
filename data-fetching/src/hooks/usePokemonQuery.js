import { useQuery } from '@tanstack/react-query';

import { fetchPokemon } from '../apis/pokemon';

export default function usePokemonQuery() {
  return useQuery({
    queryKey: ['pokemon'],
    queryFn: fetchPokemon,
  });
}
