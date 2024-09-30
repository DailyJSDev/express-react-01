import './player.css';

function Player({
  user: { _id: id, firstname, lastname, favorite: isFavorite },
  setFavorite,
}) {
  const favButtonLabel = isFavorite ? 'Remove Favorite' : 'Add to Favorites';

  return (
    <li>
      <span>
        {firstname} {lastname} {isFavorite ? ' - Fan Fave' : ''}
      </span>
      <button
        className={isFavorite ? 'favorite' : 'unfavorite'}
        onClick={() => setFavorite({ id, favorite: !isFavorite })}
      >
        {favButtonLabel}
      </button>
    </li>
  );
}

export { Player };
