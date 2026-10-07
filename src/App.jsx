import './App.css'
import axios from "axios";
import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";


function App() {
    const [pokemons, setPokemons] = useState([]);
    const [offset, setOffset] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
    const params = new URLSearchParams({
        limit: 20,
        offset: offset,
    });

    useEffect(() => {
        const controller = new AbortController();

        async function getPokemons() {
            setLoading(true);
            setError(false);

            try {
                const response = await axios.get(`${BASE_URL}?${params}`, {
                    signal: controller.signal
                });

                const data = response.data;
                console.log("ALLE POKEMONS");
                console.log(data);

                setNext(data.next);
                setPrevious(data.previous);

                //TEST met request en response apart om promise te controleren
                // const requests = data.results.map((pokemon) => {
                //     return axios.get(pokemon.url);
                // });
                // console.log(requests);
                // const responses = await Promise.all(requests);
                // console.log(responses);

                const responses = await Promise.all(
                    data.results.map((pokemon) =>
                        axios.get(pokemon.url, {
                            signal: controller.signal
                        })
                    )
                )
                console.log("ALLE INFO PER 20");
                console.log(responses)
                console.log("ENKEL DATA 1 POKEMON");
                console.log(responses[0].data);

                const pokemonData = responses.map((response) => response.data);
                setPokemons(pokemonData);

                console.log("ENKEL DATA PER 20");
                console.log(pokemonData);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error(error);
                    setError(true);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        getPokemons();

        return () => {
            controller.abort();
        };
    }, [offset]);

    return (
        <>
            <div className="pagination">
                <button
                    onClick={() => setOffset(offset - 20)}
                    disabled={previous === null || loading}
                >
                    Vorige
                </button>

                <button
                    onClick={() => setOffset(offset + 20)}
                    disabled={next === null || loading}
                >
                    Volgende
                </button>
            </div>

            {loading && <p>Pokemons worden geladen...</p>}

            {error && (
                <p>Er is iets fout gegaan bij het ophalen van de Pokemons</p>
            )}

            {/*Met component*/}
            {!loading && !error && (
                <div className="pokemon-grid">
                    {pokemons.map((pokemon) => (
                        <PokemonCard key={pokemon.id} pokemon={pokemon} />
                    ))}
                </div>
            )}

            {/*TEST met 1 pokemon*/}
            {/*<h1>Gotta catch em all!</h1>*/}
            {/*<p>{pokemons[0]?.name}</p>*/}
            {/*<img src={pokemons[0]?.sprites.front_default} alt={pokemons[0]?.name} />*/}
            {/*<p>{pokemons[0]?.moves.length}</p>*/}
            {/*<p>{pokemons[0]?.weight}</p>*/}
            {/*{pokemons[0]?.abilities.map((item) => (*/}
            {/*    <p key={item.ability.name}>{item.ability.name}</p>*/}
            {/*))}*/}

            {/*TEST met alle pokemons*/}
            {/*{pokemons.map((pokemon) => (*/}
            {/*    <div key={pokemon.id}>*/}
            {/*        <p>{pokemon.name}</p>*/}

            {/*        <img*/}
            {/*            src={pokemon.sprites.front_default}*/}
            {/*            alt={pokemon.name}*/}
            {/*        />*/}

            {/*        <p>Moves: {pokemon.moves.length}</p>*/}
            {/*        <p>Weight: {pokemon.weight}</p>*/}

            {/*        {pokemon.abilities.map((item) => (*/}
            {/*            <p key={item.ability.name}>*/}
            {/*                {item.ability.name}*/}
            {/*            </p>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*))}*/}

        </>
    )
}

export default App