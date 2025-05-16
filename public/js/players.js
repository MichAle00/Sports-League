document.addEventListener('DOMContentLoaded', function() {
	const playersList = document.getElementById('playersList');
	const searchInput = document.getElementById('searchInput');
	const searchBtn = document.getElementById('searchBtn');
	const playerForm = document.getElementById('playerForm');
	const playerModal = new bootstrap.Modal(document.getElementById('playerModal'));
	const playerDetailsModal = new bootstrap.Modal(document.getElementById('playerDetailsModal'));

	let isEditing = false;
	let currentPlayerId = null;

	// Load all players on page load
	fetchPlayers();

	// Search functionality
	searchBtn.addEventListener('click', function() {
	const searchTerm = searchInput.value.trim();
	if (searchTerm) {
		searchPlayers(searchTerm);
	} else {
		fetchPlayers();
	}
	});

	// Form submission
	playerForm.addEventListener('submit', function(e) {
	e.preventDefault();
	
	const playerData = {
		name: document.getElementById('name').value,
		team: document.getElementById('team').value,
		position: document.getElementById('position').value,
		jersey_number: document.getElementById('jerseyNumber').value,
		age: document.getElementById('age').value
	};
	
	if (isEditing) {
		updatePlayer(currentPlayerId, playerData);
	} else {
		createPlayer(playerData);
	}
	});

	// Fetch all players
	function fetchPlayers() {
	fetch('/api/players')
		.then(response => response.json())
		.then(players => {
		displayPlayers(players);
		})
		.catch(error => {
		console.error('Error:', error);
		playersList.innerHTML = `
			<div class="col-12">
			<div class="alert alert-danger">Failed to load players. Please try again later.</div>
			</div>
		`;
		});
	}

	// Search players
	function searchPlayers(term) {
	fetch(`/api/players/search?term=${encodeURIComponent(term)}`)
		.then(response => response.json())
		.then(players => {
		displayPlayers(players);
		})
		.catch(error => {
		console.error('Error:', error);
		});
	}

	// Display players
	function displayPlayers(players) {
	if (players.length === 0) {
		playersList.innerHTML = `
		<div class="col-12">
			<div class="alert alert-info">No players found.</div>
		</div>
		`;
		return;
	}
	
	playersList.innerHTML = '';
	
	players.forEach(player => {
		const playerCard = document.createElement('div');
		playerCard.className = 'col-md-4 mb-4';
		playerCard.innerHTML = `
		<div class="card player-card h-100">
			<div class="card-body">
			<div class="d-flex align-items-start">
				<img src="https://via.placeholder.com/100" alt="${player.name}" class="rounded-circle me-3" width="60" height="60">
				<div>
				<h5 class="card-title mb-1">${player.name}</h5>
				<p class="card-text mb-1"><small class="text-muted">${player.team}</small></p>
				<span class="badge bg-primary">${player.position}</span>
				<span class="badge bg-secondary">#${player.jersey_number}</span>
				</div>
			</div>
			</div>
			<div class="card-footer bg-transparent d-flex justify-content-between">
			<button class="btn btn-sm btn-outline-primary view-btn" data-id="${player.id}">
				<i class="fas fa-eye"></i> View
			</button>
			<div>
				<button class="btn btn-sm btn-outline-secondary edit-btn" data-id="${player.id}">
				<i class="fas fa-edit"></i>
				</button>
				<button class="btn btn-sm btn-outline-danger delete-btn" data-id="${player.id}">
				<i class="fas fa-trash"></i>
				</button>
			</div>
			</div>
		</div>
		`;
		playersList.appendChild(playerCard);
	});
	
	// Add event listeners to buttons
	document.querySelectorAll('.view-btn').forEach(btn => {
		btn.addEventListener('click', function() {
		const playerId = this.getAttribute('data-id');
		viewPlayerDetails(playerId);
		});
	});
	
	document.querySelectorAll('.edit-btn').forEach(btn => {
		btn.addEventListener('click', function() {
		const playerId = this.getAttribute('data-id');
		editPlayer(playerId);
		});
	});
	
	document.querySelectorAll('.delete-btn').forEach(btn => {
		btn.addEventListener('click', function() {
		const playerId = this.getAttribute('data-id');
		if (confirm('Are you sure you want to delete this player?')) {
			deletePlayer(playerId);
		}
		});
	});
	}

	// View player details
	function viewPlayerDetails(playerId) {
	fetch(`/api/players/${playerId}`)
		.then(response => response.json())
		.then(player => {
		document.getElementById('playerDetailsTitle').textContent = player.name;
		document.getElementById('playerDetailsName').textContent = player.name;
		document.getElementById('playerDetailsTeam').textContent = player.team;
		document.getElementById('playerDetailsPosition').textContent = player.position;
		document.getElementById('playerDetailsJersey').textContent = `#${player.jersey_number}`;
		document.getElementById('playerDetailsAge').textContent = player.age;
		
		// Stats
		document.getElementById('playerGoals').textContent = player.stats.goals;
		document.getElementById('playerAssists').textContent = player.stats.assists;
		document.getElementById('playerYellows').textContent = player.stats.yellow_cards;
		document.getElementById('playerReds').textContent = player.stats.red_cards;
		
		// TODO: Load player events from another API endpoint if needed
		
		playerDetailsModal.show();
		})
		.catch(error => {
		console.error('Error:', error);
		});
	}

	// Create player
	function createPlayer(playerData) {
	fetch('/api/players', {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
		},
		body: JSON.stringify(playerData)
	})
		.then(response => response.json())
		.then(player => {
		fetchPlayers();
		playerModal.hide();
		playerForm.reset();
		})
		.catch(error => {
		console.error('Error:', error);
		});
	}

	// Edit player
	function editPlayer(playerId) {
	fetch(`/api/players/${playerId}`)
		.then(response => response.json())
		.then(player => {
		document.getElementById('modalTitle').textContent = 'Edit Player';
		document.getElementById('playerId').value = player.id;
		document.getElementById('name').value = player.name;
		document.getElementById('team').value = player.team;
		document.getElementById('position').value = player.position;
		document.getElementById('jerseyNumber').value = player.jersey_number;
		document.getElementById('age').value = player.age;
		
		isEditing = true;
		currentPlayerId = playerId;
		document.getElementById('saveBtn').textContent = 'Update Player';
		
		playerModal.show();
		})
		.catch(error => {
		console.error('Error:', error);
		});
	}

	// Update player
	function updatePlayer(playerId, playerData) {
	fetch(`/api/players/${playerId}`, {
		method: 'PUT',
		headers: {
		'Content-Type': 'application/json',
		},
		body: JSON.stringify(playerData)
	})
		.then(response => response.json())
		.then(player => {
		fetchPlayers();
		playerModal.hide();
		resetForm();
		})
		.catch(error => {
		console.error('Error:', error);
		});
	}

	// Delete player
	function deletePlayer(playerId) {
	fetch(`/api/players/${playerId}`, {
		method: 'DELETE'
	})
		.then(() => {
		fetchPlayers();
		})
		.catch(error => {
		console.error('Error:', error);
		});
	}

	// Reset form
	function resetForm() {
	playerForm.reset();
	isEditing = false;
	currentPlayerId = null;
	document.getElementById('modalTitle').textContent = 'Add New Player';
	document.getElementById('saveBtn').textContent = 'Save Player';
	}

	// Reset form when modal is closed
	document.getElementById('playerModal').addEventListener('hidden.bs.modal', function() {
	resetForm();
	});
});