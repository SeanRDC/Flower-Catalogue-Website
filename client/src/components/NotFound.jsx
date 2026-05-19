import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-code">404</h1>
      <h2 className="not-found-title">Page not found</h2>
      <p className="not-found-text">
        The flower you are looking for might have been moved, deleted, or never existed.
      </p>
      <Link to="/" className="not-found-link">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;