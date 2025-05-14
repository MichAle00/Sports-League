import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const MatchManager = () => {
  const [matches, setMatches] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    homeTeam: '',
    awayTeam: '',
    matchDate: '',
    location: '',
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches');
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateMatch(formData.id);
    } else {
      await createMatch();
    }
    resetForm();
    fetchMatches();
  };

  const createMatch = async () => {
    try {
      await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  const editMatch = (match) => {
    setFormData({ ...match });
    setIsEditing(true);
  };

  const updateMatch = async (id) => {
    try {
      await fetch(`/api/matches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  const deleteMatch = async (id) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await fetch(`/api/matches/${id}`, { method: 'DELETE' });
        fetchMatches();
      } catch (error) {
        console.error('Error deleting match:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      homeTeam: '',
      awayTeam: '',
      matchDate: '',
      location: '',
      homeScore: 0,
      awayScore: 0,
      status: 'scheduled',
    });
    setIsEditing(false);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'secondary';
      case 'ongoing':
        return 'warning';
      case 'completed':
        return 'success';
      case 'postponed':
        return 'danger';
      default:
        return 'primary';
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Gestor de ligas</h1>

      <div className="card mb-5">
        <div className="card-header">
          <h3>{isEditing ? 'Editar partido' : 'Agregar nuevo partido'}</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Equipo de casa</label>
                <input
                  type="text"
                  className="form-control"
                  name="homeTeam"
                  value={formData.homeTeam}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Equipo visitante</label>
                <input
                  type="text"
                  className="form-control"
                  name="awayTeam"
                  value={formData.awayTeam}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Fecha del encuentro</label>
                <input
                  type="date"
                  className="form-control"
                  name="matchDate"
                  value={formData.matchDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Lugar</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Puntuacion de casa</label>
                <input
                  type="number"
                  className="form-control"
                  name="homeScore"
                  value={formData.homeScore}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Puntuacion visitante</label>
                <input
                  type="number"
                  className="form-control"
                  name="awayScore"
                  value={formData.awayScore}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="scheduled">Programado</option>
                  <option value="ongoing">En curso</option>
                  <option value="completed">Completado</option>
                  <option value="postponed">Postpuesto</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-primary me-2">
                {isEditing ? 'Actualizar partido' : 'Agregar partido'}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <h2 className="mb-4">Partidos por venir</h2>
      <div className="row">
        {matches.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">No hay partidos programados todavía.</div>
          </div>
        ) : (
          matches.map((match) => (
            <div key={match.id} className="col-md-6 mb-4">
              <div className={`card h-100 match-card status-${match.status}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="card-title">
                        {match.homeTeam} vs {match.awayTeam}
                      </h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {new Date(match.matchDate).toLocaleDateString()}
                      </h6>
                      <p className="card-text">
                        <strong>Lugar:</strong> {match.location}
                        <br />
                        <strong>Estado:</strong>{' '}
                        <span className={`badge bg-${getStatusBadgeColor(match.status)}`}>
                          {match.status}
                        </span>
                      </p>
                    </div>
                    {match.status === 'completed' && (
                      <div className="text-center">
                        <h3 className="mb-0">
                          {match.homeScore} - {match.awayScore}
                        </h3>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-footer bg-transparent">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => editMatch(match)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteMatch(match.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MatchManager;