import React, { useState, useEffect } from 'react';

function TeamModal({ team, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    founded_year: '',
    stadium: '',
    coach: '',
    logo_url: ''
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || '',
        city: team.city || '',
        founded_year: team.founded_year || '',
        stadium: team.stadium || '',
        coach: team.coach || '',
        logo_url: team.logo_url || ''
      });
    } else {
      setFormData({
        name: '',
        city: '',
        founded_year: '',
        stadium: '',
        coach: '',
        logo_url: ''
      });
    }
  }, [team]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal fade" id="teamModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{team ? 'Edit Team' : 'Add New Team'}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="teamName" className="form-label">Nombre del equipo*</label>
                <input
                  type="text"
                  className="form-control"
                  id="teamName"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="teamCity" className="form-label">Ciudad*</label>
                <input
                  type="text"
                  className="form-control"
                  id="teamCity"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="foundedYear" className="form-label">Año de fundación</label>
                  <input
                    type="number"
                    className="form-control"
                    id="foundedYear"
                    name="founded_year"
                    value={formData.founded_year}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="stadium" className="form-label">Estadio</label>
                  <input
                    type="text"
                    className="form-control"
                    id="stadium"
                    name="stadium"
                    value={formData.stadium}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="coach" className="form-label">Coach</label>
                <input
                  type="text"
                  className="form-control"
                  id="coach"
                  name="coach"
                  value={formData.coach}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="logoUrl" className="form-label">Logo URL</label>
                <input
                  type="url"
                  className="form-control"
                  id="logoUrl"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Guardar equipo</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TeamModal;