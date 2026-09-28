<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-green.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-lightgreen.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
![Framer](https://img.shields.io/badge/Framer-%23000000.svg?style=for-the-badge&logo=framer&logoColor=blue)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Peony - Flower Catalogue Website</h3>

  <p align="center">
    A sophisticated full-stack MERN botanical encyclopedia and curation platform. Features a custom botanical classification engine, interactive filtering, and personalized user collections.
    <br />
    <br />
    <a href="https://flower-catalogue-website.vercel.app/"><strong>View Live Demo »</strong></a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#live-preview">Live Preview</a></li>
    <li><a href="#key-features">Key Features</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

Peony is a sophisticated, full-stack botanical encyclopedia designed to bridge the gap between complex biological data and an elegant, highly visual user experience. Built on the MERN stack, the application serves as both a comprehensive catalog of 200 uniquely classified flowers and a personal curation tool for botanical enthusiasts. The architecture is engineered to handle deep, multi-parameter database queries seamlessly without sacrificing frontend performance or fluid UI animations.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* **Frontend Architecture:** React (Vite)
* **Animations & Interactivity:** Framer Motion
* **Backend Runtime:** Node.js & Express.js
* **Database:** MongoDB Atlas (M0 Cluster) with custom schema design
* **Authentication:** Custom OTP Verification & Google OAuth
* **Deployment:** Vercel (Client) & Render (Server)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LIVE PREVIEW -->
## Live Preview

Peony is a fully deployed MERN-stack application. There is no need to clone the repository or set up a local development environment to experience the project. 

You can explore the interactive botanical engine, test the complex filtering systems, and curate your own collections directly in your browser:

* 🔗 **[Visit the Live Application - www.flower-catalogue-website.vercel.app](https://flower-catalogue-website.vercel.app)**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- KEY FEATURES -->
## Key Features

### Botanical Classification Engine
* **Extensive Database:** A robust backend cataloging 200 uniquely classified flowers with deep metric associations.
* **Advanced Multi-Parameter Filtering:** Users can seamlessly query the database based on highly specific traits, including color, petal shape, type, and symbolism, utilizing a highly optimized Mongoose schema.

### Authentication & Curation
* **Secure Login:** Integrated user authentication supporting both seamless Google OAuth and custom OTP (One Time Password) email verification.
* **Personalized Collections:** Authenticated users can securely curate and save their own personal collections of favorite flowers directly to their profile database.

### Immersive User Experience
* **Interactive UI:** Fluid page transitions, modal reveals, and interactive card elements powered by Framer Motion, delivering a polished and responsive frontend experience.
* **Complex System Design:** Architected to handle high-performance data querying while maintaining a clean, highly visual frontend encyclopedia with progressive image loading.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PROJECT STRUCTURE -->
## Project Structure

```text
├── client/                           # React (Vite) frontend application
│   ├── public/                       # Static public assets
│   │   ├── heroimage.jpg             # Landing page background
│   │   └── peony-logo.jpg            # Brand logo
│   ├── src/                          # Frontend source code
│   │   ├── api/                      # API communication logic
│   │   │   └── client.js             # Axios/fetch configurations
│   │   ├── assets/                   # Image and media assets
│   │   ├── components/               # Reusable UI components
│   │   │   ├── AuthModal.jsx         # Secure authentication interface
│   │   │   ├── Browse.jsx            # Catalog browsing grid
│   │   │   ├── Collections.jsx       # User collections display
│   │   │   ├── Favorites.jsx         # Liked items component
│   │   │   ├── FilterBar.jsx         # Multi-parameter search filter
│   │   │   ├── FlowerCard.jsx        # Individual botanical display card
│   │   │   ├── ProgressiveImage.jsx  # Optimized image loader
│   │   │   └── [Other UI Components] # Footer, Hero, Navbar, Modals, etc.
│   │   ├── context/                  # React Context providers
│   │   │   └── AuthContext.jsx       # Global authentication state management
│   │   ├── pages/                    # Main application views
│   │   │   └── Browse.jsx            # Main encyclopedia page
│   │   ├── styles/                   # CSS modules and component styles
│   │   │   ├── global.css            # Global application styles
│   │   │   ├── modal.css             # Auth and overlay styles
│   │   │   └── [Component].css       # Component-specific stylesheets
│   │   ├── App.jsx                   # Root application component
│   │   └── main.jsx                  # React DOM render entry point
│   ├── eslint.config.js              # Linter configuration
│   ├── package.json                  # Frontend dependencies and scripts
│   ├── vercel.json                   # Vercel deployment routing configuration
│   └── vite.config.js                # Vite bundler configuration
├── server/                           # Express.js backend application
│   ├── models/                       # Mongoose database schemas
│   │   ├── Flower.js                 # Botanical data and classification schema
│   │   └── User.js                   # User account and collections schema
│   ├── routes/                       # Express API routes
│   │   └── auth.js                   # Authentication endpoints (OTP/OAuth)
│   ├── index.js                      # Main Express server entry point
│   ├── package.json                  # Backend dependencies and scripts
│   └── seed.js                       # Database seeding script for the catalog
├── .gitignore                        # Root git ignore file
└── package.json                      # Root workspace dependencies
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Sean Rhani Jarin Dela Cruz

Project Link: https://github.com/SeanRDC/beaded-by-unknown <br />
LinkedIn Link: https://www.linkedin.com/in/sean-rhani-dela-cruz-834573334/

<p align="right">(<a href="#readme-top">back to top</a>)</p>
