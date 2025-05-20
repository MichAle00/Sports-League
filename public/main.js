document.addEventListener('DOMContentLoaded', function() {
	const dbBtn = document.getElementById('database');
    if (dbBtn) {
        dbBtn.addEventListener('click', function() {
            dbBtn.disabled = true;
            dbBtn.textContent = 'Inicializando...';
            fetch('/api/init-db', { method: 'POST' })
                .then(res => res.json())
                .then(data => {
                    alert(data.message);
                    dbBtn.textContent = 'TEST DB';
                    dbBtn.disabled = false;
                })
                .catch(err => {
                    alert('DB Init failed: ' + err.message);
                    dbBtn.textContent = 'TEST DB';
                    dbBtn.disabled = false;
                });
        });
    }
	
	// Load upcoming matches
	fetch('/api/matches')
	.then(response => response.json())
	.then(matches => {
		const matchesContainer = document.getElementById('matchesContainer');
		matchesContainer.innerHTML = '';
		
		// Sort matches by date and get the next 3 upcoming
		const now = new Date();
		const upcomingMatches = matches
		.filter(match => new Date(match.matchDate) >= now)
		.sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate))
		.slice(0, 3);
		
		if (upcomingMatches.length === 0) {
			matchesContainer.innerHTML = `
			<div class="col-12">
				<div class="alert alert-info">No hay partido agendados por venir aún.</div>
			</div>
			`;
			return;
		}
		
	upcomingMatches.forEach(match => {
		const matchDate = new Date(match.matchDate);
		const matchCard = document.createElement('div');
		matchCard.className = 'col-md-4';
		matchCard.innerHTML = `
		<div class="card match-card h-100">
			<div class="card-body">
			<div class="d-flex justify-content-between align-items-start mb-3">
				<span class="badge bg-${getStatusColor(match.status)}">${match.status}</span>
				<small class="text-muted">${matchDate.toLocaleDateString()}</small>
			</div>
			<div class="text-center mb-3">
				<h5>${match.homeTeam} vs ${match.awayTeam}</h5>
			</div>
			<div class="text-center">
				<p class="mb-1"><i class="fas fa-map-marker-alt me-2"></i>${match.location}</p>
			</div>
			</div>
			<div class="card-footer bg-transparent">
			<a href="/manage" class="btn btn-sm btn-outline-primary w-100">Ver Detalles</a>
			</div>
		</div>
			`;
			matchesContainer.appendChild(matchCard);
		});
		})
		.catch(error => {
		console.error('Error loading matches:', error);
		document.getElementById('matchesContainer').innerHTML = `
			<div class="col-12">
			<div class="alert alert-danger">Fallo al cargar partidos, intente más tarde.</div>
			</div>
		`;
		});
	
	// Helper function to get status color
	function getStatusColor(status) {
		switch (status) {
		case 'scheduled': return 'primary';
		case 'ongoing': return 'warning';
		case 'completed': return 'success';
		case 'postponed': return 'danger';
		default: return 'secondary';
		}
	}
});