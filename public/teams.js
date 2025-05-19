document.addEventListener('DOMContentLoaded', function() {
	const teamsList = document.getElementById('teamsList');
	const searchInput = document.getElementById('searchInput');
	const searchBtn = document.getElementById('searchBtn');
	const teamForm = document.getElementById('teamForm');
	const teamModal = new bootstrap.Modal(document.getElementById('teamModal'));
	const teamDetailsModal = new bootstrap.Modal(document.getElementById('teamDetailsModal'));

	let isEditing = false;
	let currentTeamId = null;
	let teamPerformanceChart = null;

	// Load all teams on page load
	fetchTeams();

	// Search functionality
	searchBtn.addEventListener('click', function() {
	const searchTerm = searchInput.value.trim();
	if (searchTerm) {
		searchTeams(searchTerm);
	} else {
		fetchTeams();
	}
	});

	// Form submission
	teamForm.addEventListener('submit', function(e) {
	e.preventDefault();
	
	const teamData = {
		name: document.getElementById('teamName').value,
		city: document.getElementById('teamCity').value,
		founded_year: document.getElementById('foundedYear').value || null,
		stadium: document.getElementById('stadium').value || null,
		coach: document.getElementById('coach').value || null,
		logo_url: document.getElementById('logoUrl').value || null
	};
	
	if (isEditing) {
		updateTeam(currentTeamId, teamData);
	} else {
		createTeam(teamData);
	}
	});

	// Fetch all teams
	function fetchTeams() {
	fetch('/api/teams')
		.then(response => response.json())
		.then(teams => {
		displayTeams(teams);
		})
		.catch(error => {
		console.error('Error:', error);
		teamsList.innerHTML = `
			<div class="col-12">
			<div class="alert alert-danger">Fallo al cargar equipos. Pruebe de nuevo más tarde.</div>
			</div>
		`;
		});
	}

	// Display teams
	function displayTeams(teams) {
	if (teams.length === 0) {
		teamsList.innerHTML = `
		<div class="col-12">
			<div class="alert alert-info">No se encontraron equipos</div>
		</div>
		`;
		return;
	}
	
	teamsList.innerHTML = '';
	
	teams.forEach(team => {
		const teamCard = document.createElement('div');
		teamCard.className = 'col-md-6 mb-4';
		teamCard.innerHTML = `
		<div class="card team-card h-100">
			<div class="card-body">
			<div class="d-flex align-items-center">
				<img src="${team.logo_url || 'https://via.placeholder.com/60'}" alt="${team.name}" class="team-logo">
				<div>
				<h4 class="card-title mb-1">${team.name}</h4>
				<p class="card-text mb-1"><i class="fas fa-city me-1"></i> ${team.city}</p>
				${team.coach ? `<p class="card-text"><i class="fas fa-user-tie me-1"></i> ${team.coach}</p>` : ''}
				</div>
			</div>
			</div>
			<div class="card-footer bg-transparent d-flex justify-content-between">
			<button class="btn btn-sm btn-outline-primary view-btn" data-id="${team.id}">
				<i class="fas fa-eye"></i> Ver
			</button>
			<div>
				<button class="btn btn-sm btn-outline-secondary edit-btn" data-id="${team.id}">
				<i class="fas fa-edit"></i>
				</button>
				<button class="btn btn-sm btn-outline-danger delete-btn" data-id="${team.id}">
				<i class="fas fa-trash"></i>
				</button>
			</div>
			</div>
		</div>
		`;
		teamsList.appendChild(teamCard);
	});
	
	// Add event listeners to buttons
	document.querySelectorAll('.view-btn').forEach(btn => {
		btn.addEventListener('click', function() {
		const teamId = this.getAttribute('data-id');
		viewTeamDetails(teamId);
		});
	});
	
	document.querySelectorAll('.edit-btn').forEach(btn => {
		btn.addEventListener('click', function() {
		const teamId = this.getAttribute('data-id');
		editTeam(teamId);
		});
	});
	
	document.querySelectorAll('.delete-btn').forEach(btn => {
		btn.addEventListener('click', function() {
		const teamId = this.getAttribute('data-id');
		if (confirm('Seguro que desea eliminar este equipo?')) {
			deleteTeam(teamId);
		}
		});
	});
	}

	// View team details
	function viewTeamDetails(teamId) {
	fetch(`/api/teams/${teamId}`)
		.then(response => response.json())
		.then(team => {
		document.getElementById('teamDetailsTitle').textContent = team.name;
		document.getElementById('teamDetailsLogo').src = team.logo_url || 'https://via.placeholder.com/200';
		document.getElementById('teamDetailsCity').textContent = team.city;
		document.getElementById('teamDetailsFounded').textContent = team.founded_year || 'Unknown';
		document.getElementById('teamDetailsStadium').textContent = team.stadium || 'Unknown';
		document.getElementById('teamDetailsCoach').textContent = team.coach || 'Unknown';
		
		// Update stats
		if (team.stats) {
			document.getElementById('matchesPlayed').textContent = team.stats.matches_played || 0;
			document.getElementById('matchesWon').textContent = team.stats.wins || 0;
			document.getElementById('matchesDrawn').textContent = team.stats.draws || 0;
			document.getElementById('matchesLost').textContent = team.stats.losses || 0;
			document.getElementById('goalsFor').textContent = team.stats.goals_for || 0;
			document.getElementById('goalsAgainst').textContent = team.stats.goals_against || 0;
			document.getElementById('goalDifference').textContent = (team.stats.goals_for || 0) - (team.stats.goals_against || 0);
			
			// Update chart
			updatePerformanceChart(team.stats);
		}
		
		// Update players table
		const playersTable = document.querySelector('#teamPlayersTable tbody');
		playersTable.innerHTML = '';
		
		if (team.players && team.players.length > 0) {
			team.players.forEach((player, index) => {
			const row = document.createElement('tr');
			row.innerHTML = `
				<td>${index + 1}</td>
				<td>
				<div class="d-flex align-items-center">
					<img src="https://via.placeholder.com/40" alt="${player.name}" class="player-avatar">
					<span>${player.name}</span>
				</div>
				</td>
				<td>${player.position}</td>
				<td>${player.age}</td>
				<td>
				<button class="btn btn-sm btn-outline-primary view-player-btn" data-id="${player.id}">
					<i class="fas fa-eye"></i>
				</button>
				</td>
			`;
			playersTable.appendChild(row);
			});
		} else {
			playersTable.innerHTML = `
			<tr>
				<td colspan="5" class="text-center text-muted">No se encontraron jugadores para este equipo</td>
			</tr>
			`;
		}
		
		teamDetailsModal.show();
		})
		.catch(error => {
		console.error('Error:', error);
		});
	}

	// Update performance chart
	function updatePerformanceChart(stats) {
	const ctx = document.getElementById('teamPerformanceChart').getContext('2d');
	
	// Destroy previous chart if exists
	if (teamPerformanceChart) {
		teamPerformanceChart.destroy();
	}
	
	teamPerformanceChart = new Chart(ctx, {
		type: 'bar',
		data: {
		labels: ['Victorias', 'Empates', 'Derrotas'],
		datasets: [{
			label: 'Resultados de partidos',
			data: [stats.wins || 0, stats.draws || 0, stats.losses || 0],
			backgroundColor: [
			'rgba(40, 167, 69, 0.7)',
			'rgba(255, 193, 7, 0.7)',
			'rgba(220, 53, 69, 0.7)'
			],
			borderColor: [
			'rgba(40, 167, 69, 1)',
			'rgba(255, 193, 7, 1)',
			'rgba(220, 53, 69, 1)'
			],
			borderWidth: 1
		}]
		},
		options: {
		responsive: true,
		scales: {
			y: {
			beginAtZero: true
			}
		}
		}
	});
	}

	// Create team
	function createTeam(teamData) {
	fetch('/api/teams', {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
		},
		body: JSON.stringify(teamData)
	})
		.then(response => response.json())
		.then(team => {
		fetchTeams();
		teamModal.hide();
		teamForm.reset();
		})
		.catch(error => {
		console.error('Error:', error);
		});
	}

	// Edit team
	function editTeam(teamId) {
	fetch(`/api/teams/${teamId}`)
		.then(response => response.json())
		.then(team => {
		document.getElementById('modalTitle').textContent = 'Editar Equipo';
		document.getElementById('teamId').value = team.id;
		document.getElementById('teamName').value = team.name;
		document.getElementById('teamCity').value = team.city;
		document.getElementById('foundedYear').value = team.founded_year || '';
		document.getElementById('stadium').value = team.stadium || '';
		document.getElementById('coach').value = team.coach || '';
		document.getElementById('logoUrl').value = team.logo_url || '';
		
		isEditing = true;
		currentTeamId = teamId;
		document.getElementById('saveBtn').textContent = 'Actualizar equipo';
		
		teamModal.show();
		})
		.catch(error => {
		console.error('Error:', error);
		});
	}

	// Update team
	function updateTeam(teamId, teamData) {
	fetch(`/api/teams/${teamId}`, {
		method: 'PUT',
		headers: {
		'Content-Type': 'application/json',
		},
		body: JSON.stringify(teamData)
	})
		.then(response => response.json())
		.then(team => {
		fetchTeams();
		teamModal.hide();
		resetForm();
		})
		.catch(error => {
		console.error('Error:', error);
		});
	}

	// Delete team
	function deleteTeam(teamId) {
	fetch(`/api/teams/${teamId}`, {
		method: 'DELETE'
	})
		.then(() => {
		fetchTeams();
		})
		.catch(error => {
		console.error('Error:', error);
		});
	}

	// Reset form
	function resetForm() {
	teamForm.reset();
	isEditing = false;
	currentTeamId = null;
	document.getElementById('modalTitle').textContent = 'Agregar Equipo';
	document.getElementById('saveBtn').textContent = 'Guardar Equipo';
	}

	// Reset form when modal is closed
	document.getElementById('teamModal').addEventListener('hidden.bs.modal', function() {
	resetForm();
	});
});