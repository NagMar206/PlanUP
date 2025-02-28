import React from 'react';
import '../Style/HomePage.css';
import { Link } from 'react-router-dom';
import 'tachyons/css/tachyons.min.css';



function HomePage() {
  return (
    <div className="homepage">
      <h1>Üdvözlünk a PlanUp-ban!</h1>
      <p>A legjobb platform, hogy felfedezd a programokat, eseményeket és kalandokat.</p>
      <Link to="/swipe">
    <button className="explore-button">Fedezd fel most!</button>
  </Link>
    </div>
  );
}

export default HomePage;
