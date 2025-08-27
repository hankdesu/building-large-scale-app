// import { useEffect, useState } from 'react';
import axios from 'axios';
// import { useQuery } from '@tanstack/react-query';
import { faker } from '@faker-js/faker';

import { getRandomIntInclusive } from '../utils/helper';
import usePokemonQuery from '../hooks/usePokemonQuery';
import useUserMutation from '../hooks/useUserMutation';

async function fetchPokemon() {
  const id = getRandomIntInclusive(1, 151);
  const response = await axios(`https://pokeapi.co/api/v2/pokemon/${id}`);

  return response.data;
}

// const placeholderData = {
//   id: 0,
//   name: 'Guess Who I am',
//   sprites: {
//     other: {
//       'official-artwork': {
//         front_default: '/public/guesswhoiam.jpg',
//       },
//     },
//   },
// };

function ReactQueryPage() {
  const { data: pokemon, isLoading } = usePokemonQuery();
  const { mutate } = useUserMutation();

  function handleClick() {
    mutate({
      name: faker.person.fullName(),
      hometown: faker.location.city(),
    });
  }

  //   const [defer, setDefer] = useState(false);
  // const {
  //   data: pokemon,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ['pokemon'],
  //   queryFn: fetchPokemon,
  // staleTime: 1000 * 60,
  // placeholderData,
  // enabled: defer
  // });

  //   useEffect(() => {
  //     if (!defer) {
  //         setTimeout(() => {
  //             setDefer(!defer);
  //         }, 2000);
  //     }
  //   }, [defer]);

  // if (isError) {
  //   console.error(error);
  // }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h2>
        {pokemon?.id}
        <br />
        {pokemon?.name?.[0]?.toUpperCase()}
        {pokemon?.name?.slice(1)}
      </h2>
      <div style={{ width: '475px', height: '475px' }}>
        <img
          style={{ width: '100%', height: '100%' }}
          src={pokemon?.sprites?.other?.['official-artwork']?.front_default}
        />
      </div>
      <button onClick={handleClick}>Add user</button>
    </>
  );
}

export default ReactQueryPage;
