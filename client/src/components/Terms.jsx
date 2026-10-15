import { useEffect } from 'react';
import '../styles/Legal.css';

const Terms = () => {
  useEffect(() => {
    document.title = 'Terms of Service | Peony';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-container">
      <div className="legal-content">
        <div className="legal-header">
          <h1 className="legal-title">Terms of Service</h1>
          <div className="legal-date">Last Updated: May 2026</div>
        </div>

        <div className="legal-body">
          <p>Welcome to Peony. By accessing our website and catalog, you agree to be bound by these Terms of Service.</p>

          <h2>1. Use of the Platform</h2>
          <p>Peony provides a digital catalog for browsing, discovering, and curating collections of flowers. You agree to use this platform only for lawful purposes and in a way that does not infringe upon the rights of others.</p>

          <h2>2. User Accounts</h2>
          <p>To access certain features, such as saving Favorites or building Collections, you may be required to create an account. You are responsible for safeguarding your account credentials. Peony reserves the right to suspend or terminate accounts that violate these terms.</p>

          <h2>3. Intellectual Property</h2>
          <p>The content, organization, graphics, design, and other matters related to the Site are protected under applicable copyrights and trademarks. The copying, redistribution, or publication by you of any such matters is strictly prohibited unless explicitly permitted by the platform.</p>

          <h2>4. User-Generated Content</h2>
          <p>When you create collections or save favorites, you grant Peony a non-exclusive license to store and display this data within your account profile. We do not claim ownership of the underlying imagery.</p>

          <h2>5. Limitation of Liability</h2>
          <p>The information provided on Peony is for general informational purposes. We do not guarantee the absolute accuracy of botanical descriptions or lifecycles. Peony and its operators shall not be held liable for any damages arising from the use of this service.</p>

          <h2>6. Contact</h2>
          <p>If you have any questions regarding these terms, please contact us via our <a href="/support">Support page</a>. Operated by Sean Rhani Dela Cruz.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;