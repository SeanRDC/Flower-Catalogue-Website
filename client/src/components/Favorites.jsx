import SavedFlowers from './SavedFlowers';

const FAVORITES_CONFIG = {
  title: 'Favorites',
  noun: 'favorites',
  pickFlowers: (user) => user.favorites || [],
  removeEndpoint: '/favorites/remove',
  clearEndpoint: '/favorites/clear',
  clearConfirm: 'Are you sure you want to remove all your favorite flowers?',
  noMatches: 'No matching favorites found.',
  empty: "You haven't added any favorites yet.",
};

const Favorites = () => <SavedFlowers config={FAVORITES_CONFIG} />;

export default Favorites;
