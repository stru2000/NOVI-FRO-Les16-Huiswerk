import './PokemonCard.css'

function PokemonCard({ pokemon }) {
    return (
        <article className="pokemon-card">
            <h2>{pokemon.name}</h2>

            <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
            />

            <p>Moves: {pokemon.moves.length}</p>
            <p>Weight: {pokemon.weight}</p>

            <div className="abilities">
                <p>Abilities:</p>

                {pokemon.abilities.map((item) => (
                    <span key={item.ability.name}>{item.ability.name}</span>
                ))}
            </div>
        </article>
    );
}



export default PokemonCard;