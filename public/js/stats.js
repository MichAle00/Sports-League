document.addEventListener('DOMContentLoaded', function() {
      // Load all stats
      loadQuickStats();
      loadTeamStandings();
      loadTopScorers();
      loadTopAssists();
      loadMostCards();
      loadRecentMatches();
      
      // Load quick stats (top performers)
      function loadQuickStats() {
        fetch('/api/stats/top-scorers')
          .then(response => response.json())
          .then(data => {
            if (data.length > 0) {
              const topScorer = data[0];
              document.getElementById('topScorer').innerHTML = `
                <img src="https://via.placeholder.com/40" alt="${topScorer.name}" class="player-avatar">
                <div class="text-start">
                  <strong>${topScorer.name}</strong><br>
                  <small>${topScorer.team} • ${topScorer.goals || 0} goals</small>
                </div>
              `;
            }
          });
        
        fetch('/api/stats/top-assists')
          .then(response => response.json())
          .then(data => {
            if (data.length > 0) {
              const topAssister = data[0];
              document.getElementById('topAssister').innerHTML = `
                <img src="https://via.placeholder.com/40" alt="${topAssister.name}" class="player-avatar">
                <div class="text-start">
                  <strong>${topAssister.name}</strong><br>
                  <small>${topAssister.team} • ${topAssister.assists || 0} assists</small>
                </div>
              `;
            }
          });
        
        fetch('/api/stats/most-cards')
          .then(response => response.json())
          .then(data => {
            if (data.length > 0) {
              const mostYellows = data.sort((a, b) => b.yellow_cards - a.yellow_cards)[0];
              const mostReds = data.sort((a, b) => b.red_cards - a.red_cards)[0];
              
              document.getElementById('mostYellows').innerHTML = `
                <img src="https://via.placeholder.com/40" alt="${mostYellows.name}" class="player-avatar">
                <div class="text-start">
                  <strong>${mostYellows.name}</strong><br>
                  <small>${mostYellows.team} • ${mostYellows.yellow_cards || 0} yellows</small>
                </div>
              `;
              
              document.getElementById('mostReds').innerHTML = `
                <img src="https://via.placeholder.com/40" alt="${mostReds.name}" class="player-avatar">
                <div class="text-start">
                  <strong>${mostReds.name}</strong><br>
                  <small>${mostReds.team} • ${mostReds.red_cards || 0} reds</small>
                </div>
              `;
            }
          });
      }
      
      // Load team standings
      function loadTeamStandings() {
        fetch('/api/stats/team-standings')
          .then(response => response.json())
          .then(teams => {
            const tableBody = document.querySelector('#standingsTable tbody');
            tableBody.innerHTML = '';
            
            teams.forEach((team, index) => {
              const row = document.createElement('tr');
              row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                  <img src="https://via.placeholder.com/30" alt="${team.team}" class="team-logo">
                  <strong>${team.team}</strong>
                </td>
                <td>${team.matches_played || 0}</td>
                <td>${team.wins || 0}</td>
                <td>${team.draws || 0}</td>
                <td>${team.losses || 0}</td>
                <td>${team.goals_for || 0}</td>
                <td>${team.goals_against || 0}</td>
                <td>${team.goal_difference || 0}</td>
                <td><strong>${team.points || 0}</strong></td>
              `;
              tableBody.appendChild(row);
            });
          });
      }
      
      // Load top scorers
      function loadTopScorers() {
        fetch('/api/stats/top-scorers')
          .then(response => response.json())
          .then(players => {
            const container = document.getElementById('topScorersList');
            container.innerHTML = '';
            
            if (players.length === 0) {
              container.innerHTML = '<p class="text-muted">No data available</p>';
              return;
            }
            
            players.forEach((player, index) => {
              const playerElement = document.createElement('div');
              playerElement.className = 'd-flex justify-content-between align-items-center mb-3';
              playerElement.innerHTML = `
                <div class="d-flex align-items-center">
                  <span class="badge bg-primary me-2">${index + 1}</span>
                  <img src="https://via.placeholder.com/40" alt="${player.name}" class="player-avatar">
                  <div>
                    <h6 class="mb-0">${player.name}</h6>
                    <small class="text-muted">${player.team}</small>
                  </div>
                </div>
                <span class="badge bg-success badge-lg">${player.goals || 0} goals</span>
              `;
              container.appendChild(playerElement);
            });
          });
      }
      
      // Load top assists
      function loadTopAssists() {
        fetch('/api/stats/top-assists')
          .then(response => response.json())
          .then(players => {
            const container = document.getElementById('topAssistsList');
            container.innerHTML = '';
            
            if (players.length === 0) {
              container.innerHTML = '<p class="text-muted">No data available</p>';
              return;
            }
            
            players.forEach((player, index) => {
              const playerElement = document.createElement('div');
              playerElement.className = 'd-flex justify-content-between align-items-center mb-3';
              playerElement.innerHTML = `
                <div class="d-flex align-items-center">
                  <span class="badge bg-primary me-2">${index + 1}</span>
                  <img src="https://via.placeholder.com/40" alt="${player.name}" class="player-avatar">
                  <div>
                    <h6 class="mb-0">${player.name}</h6>
                    <small class="text-muted">${player.team}</small>
                  </div>
                </div>
                <span class="badge bg-info badge-lg">${player.assists || 0} assists</span>
              `;
              container.appendChild(playerElement);
            });
          });
      }
      
      // Load most cards
      function loadMostCards() {
        fetch('/api/stats/most-cards')
          .then(response => response.json())
          .then(players => {
            const yellowContainer = document.getElementById('mostYellowCardsList');
            const redContainer = document.getElementById('mostRedCardsList');
            
            yellowContainer.innerHTML = '';
            redContainer.innerHTML = '';
            
            if (players.length === 0) {
              yellowContainer.innerHTML = '<p class="text-muted">No data available</p>';
              redContainer.innerHTML = '<p class="text-muted">No data available</p>';
              return;
            }
            
            // Sort by yellow cards
            const sortedByYellows = [...players].sort((a, b) => b.yellow_cards - a.yellow_cards);
            sortedByYellows.forEach((player, index) => {
              const playerElement = document.createElement('div');
              playerElement.className = 'd-flex justify-content-between align-items-center mb-3';
              playerElement.innerHTML = `
                <div class="d-flex align-items-center">
                  <span class="badge bg-primary me-2">${index + 1}</span>
                  <img src="https://via.placeholder.com/40" alt="${player.name}" class="player-avatar">
                  <div>
                    <h6 class="mb-0">${player.name}</h6>
                    <small class="text-muted">${player.team}</small>
                  </div>
                </div>
                <span class="badge bg-warning badge-lg">${player.yellow_cards || 0} yellows</span>
              `;
              yellowContainer.appendChild(playerElement);
            });
            
            // Sort by red cards
            const sortedByReds = [...players].sort((a, b) => b.red_cards - a.red_cards);
            sortedByReds.forEach((player, index) => {
              const playerElement = document.createElement('div');
              playerElement.className = 'd-flex justify-content-between align-items-center mb-3';
              playerElement.innerHTML = `
                <div class="d-flex align-items-center">
                  <span class="badge bg-primary me-2">${index + 1}</span>
                  <img src="https://via.placeholder.com/40" alt="${player.name}" class="player-avatar">
                  <div>
                    <h6 class="mb-0">${player.name}</h6>
                    <small class="text-muted">${player.team}</small>
                  </div>
                </div>
                <span class="badge bg-danger badge-lg">${player.red_cards || 0} reds</span>
              `;
              redContainer.appendChild(playerElement);
            });
          });
      }
      
      // Load recent matches
      function loadRecentMatches() {
        fetch('/api/stats/recent-matches')
          .then(response => response.json())
          .then(matches => {
            const container = document.getElementById('recentMatchesList');
            container.innerHTML = '';
            
            if (matches.length === 0) {
              container.innerHTML = '<p class="text-muted">No recent matches</p>';
              return;
            }
            
            matches.forEach(match => {
              const matchElement = document.createElement('div');
              matchElement.className = 'mb-3 p-3 border rounded';
              
              let resultBadge = '';
              if (match.status === 'completed') {
                resultBadge = `
                  <span class="badge bg-primary">
                    ${match.home_score} - ${match.away_score}
                  </span>
                `;
              } else if (match.status === 'ongoing') {
                resultBadge = '<span class="badge bg-warning">LIVE</span>';
              } else {
                resultBadge = '<span class="badge bg-secondary">Scheduled</span>';
              }
              
              matchElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <small class="text-muted">
                    ${new Date(match.match_date).toLocaleDateString()}
                  </small>
                  ${resultBadge}
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="text-end" style="flex: 1;">
                    <h5 class="mb-0">${match.home_team}</h5>
                  </div>
                  <div class="px-3 text-center">
                    <small>vs</small>
                  </div>
                  <div class="text-start" style="flex: 1;">
                    <h5 class="mb-0">${match.away_team}</h5>
                  </div>
                </div>
              `;
              container.appendChild(matchElement);
            });
          });
      }
    });