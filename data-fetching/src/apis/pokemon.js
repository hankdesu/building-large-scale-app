import { axiosFetchRequest } from '../utils/fetchRequest';
import { getRandomIntInclusive } from '../utils/helper';

export async function fetchPokemon() {
  const id = getRandomIntInclusive(1, 151);
  const pokemon = await axiosFetchRequest({
    url: `https://pokeapi.co/api/v2/pokemon/${id}`,
  });

  return pokemon;
}
