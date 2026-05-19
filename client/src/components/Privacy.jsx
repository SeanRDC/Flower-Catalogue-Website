import { motion } from 'framer-motion';
import { useEffect } from 'react';
import '../styles/Legal.css';

const Privacy = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | Peony';
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div className="legal-container">
      <div className="legal-content">
        <div className="legal-header">
          <h1 className="legal-title">Privacy Policy</h1>
          <div className="legal-date">Last Updated: May 2026</div>
        </div>

        <div className="legal-body">
          <p>At Peony, we are committed to protecting your personal information and your right to privacy. This policy explains what information we collect and how we use it.</p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li><strong>Personal Information:</strong> When you register for an account, we collect your email address and authentication credentials.</li>
            <li><strong>Usage Data:</strong> We store the flowers you add to your Favorites and Collections to provide you with a personalized experience.</li>
            <li><strong>Technical Data:</strong> Like most websites, we may collect basic technical data such as browser type, device type, and IP address to ensure our site functions properly.</li>
          </ul>

          <h2>2. How We Use Your Data</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Maintain and secure your user account.</li>
            <li>Save and retrieve your personal flower collections and favorites.</li>
            <li>Improve the functionality and user experience of the Peony catalog.</li>
          </ul>

          <h2>3. Data Storage & Security</h2>
          <p>Your data is securely stored using modern, encrypted cloud databases. We implement standard security measures to prevent unauthorized access to your account. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.</p>

          <h2>4. Cookies and Tracking</h2>
          <p>Peony uses minimal essential cookies and local storage tokens strictly necessary to keep you logged into your account and secure your session.</p>

          <h2>5. Third-Party Sharing</h2>
          <p>We do not sell, trade, or rent your personal identification information to others. We only share necessary data with trusted third-party service providers (like our cloud hosting and database partners) strictly for the purpose of operating the website.</p>

          <h2>6. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please reach out to us on our <a href="/support">Support page</a>.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Privacy;