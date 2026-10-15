import SavedFlowers from './SavedFlowers';

const COLLECTIONS_CONFIG = {
  title: 'Collections',
  noun: 'collections',
  pickFlowers: (user) => user.collections?.[0]?.flowers || [],
  removeEndpoint: '/collections/remove',
  clearEndpoint: '/collections/clear',
  clearConfirm: 'Are you sure you want to empty your entire collection?',
  noMatches: 'No matching collections found.',
  empty: "You haven't created any collections yet.",
};

const Collections = () => <SavedFlowers config={COLLECTIONS_CONFIG} />;

export default Collections;
