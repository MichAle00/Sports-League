import React from 'react';

function TeamCard({ team, onView, onEdit, onDelete }) {
  return (
    <div className="col-md-6 mb-4">
      <div className="card team-card h-100">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <img
              src={team.logo_url || 'https://via.placeholder.com/60'}
              alt={team.name}
              className="team-logo"
              style={{ width: '60px', height: '60px', objectFit: 'contain', marginRight: '15px' }}
            />
            <div>
              <h4 className="card-title mb-1">{team.name}</h4>
              <p className="card-text mb-1"><i className="fas fa-city me-1"></i> {team.city}</p>
              {team.coach && <p className="card-text"><i className="fas fa-user-tie me-1"></i> {team.coach}</p>}
            </div>
          </div>
        </div>
        <div className="card-footer bg-transparent d-flex justify-content-between">
          <button className="btn btn-sm btn-outline-primary" onClick={() => onView(team)}>
            <i className="fas fa-eye"></i> View
          </button>
          <div>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(team)}>
              <i className="fas fa-edit"></i>
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(team.id)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamCard;