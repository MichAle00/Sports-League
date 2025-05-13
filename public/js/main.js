// Fetch and display sports
async function loadSports() {
	const response = await fetch('/api/sports');
	const sports = await response.json();

	const container = document.getElementById('sports-container');
	container.innerHTML = sports.map(sport => `
		<div class="sport-card" onclick="loadTeams(${sport.id}, '${sport.name}')">
			<img src="${sport.image}" alt="${sport.name}">
			<h3>${sport.name}</h3>
		</div>
	`).join('');
}

// Load teams for a sport
window.loadTeams = async (sportId, sportName) => {
	const response = await fetch(`/api/teams/${sportId}`);
	const teams = await response.json();

	const container = document.getElementById('teams-container');
	container.innerHTML = `<h2>Teams in ${sportName}</h2>` +
		teams.map(team => `
		<div class="team-card">
			<img src="${team.logo}" alt="${team.name}">
			<h4>${team.name}</h4>
		</div>
	`).join('');
};

// Initialize
document.addEventListener('DOMContentLoaded', loadSports);
