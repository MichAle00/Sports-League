import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">
          <i className="fas fa-trophy me-2"></i>Liga
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="/matches">Partidos</a></li>
            <li className="nav-item"><a className="nav-link" href="/players">Jugadores</a></li>
            <li className="nav-item"><a className="nav-link" href="/stats">Estadisticas</a></li>
            <li className="nav-item"><a className="nav-link active" href="/teams">Equipos</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;