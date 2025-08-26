import { useEffect, useState } from 'react';

import { getRandomIntInclusive } from '../utils/helper';
import { nativeFetchRequest } from '../utils/fetchRequest';

function FetchPage() {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    async function fetchPokemon() {
      const id = getRandomIntInclusive(1, 151);

      const pokemon = await nativeFetchRequest({
        url: `https://pokeapi.co/api/v2/pokemon/${id}`,
      });
      setPokemon(pokemon);

      // try {
      //   const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

      //   if (!response.ok) {
      //     throw new Error('Response failed!');
      //   }
      //   const pokemon = await response.json();

      //   setPokemon(pokemon);
      // } catch (error) {
      //   console.error(error);
      // }
    }

    fetchPokemon();
  }, []);

  if (!pokemon) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h2>
        {pokemon?.id}
        <br />
        {pokemon?.name[0].toUpperCase()}
        {pokemon?.name.slice(1)}
      </h2>
      <div style={{ width: '475px', height: '475px' }}>
        <img
          style={{ width: '100%', height: '100%' }}
          src={pokemon?.sprites?.other?.['official-artwork']?.front_default}
        />
      </div>
    </>
  );
}

export default FetchPage;
