document.addEventListener('DOMContentLoaded', function() {
      const matchForm = document.getElementById('matchForm');
      const matchesList = document.getElementById('matchesList');
      const submitBtn = document.getElementById('submitBtn');
      const cancelBtn = document.getElementById('cancelBtn');
      const formTitle = document.getElementById('formTitle');
      
      let isEditing = false;
      let currentMatchId = null;
      
      // Load matches when page loads
      fetchMatches();
      
      // Form submission
      matchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const matchData = {
          homeTeam: document.getElementById('homeTeam').value,
          awayTeam: document.getElementById('awayTeam').value,
          matchDate: document.getElementById('matchDate').value,
          location: document.getElementById('location').value,
          homeScore: parseInt(document.getElementById('homeScore').value) || 0,
          awayScore: parseInt(document.getElementById('awayScore').value) || 0,
          status: document.getElementById('status').value
        };
        
        if (isEditing) {
          updateMatch(currentMatchId, matchData);
        } else {
          createMatch(matchData);
        }
      });
      
      // Cancel edit
      cancelBtn.addEventListener('click', function() {
        resetForm();
      });
      
      // Fetch all matches
      function fetchMatches() {
        fetch('/api/matches')
          .then(response => response.json())
          .then(data => {
            displayMatches(data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
      
      // Display matches
      function displayMatches(matches) {
        matchesList.innerHTML = '';
        
        if (matches.length === 0) {
          matchesList.innerHTML = '<div class="col-12"><div class="alert alert-info">No matches scheduled yet.</div></div>';
          return;
        }
        
        matches.forEach(match => {
          const matchCard = document.createElement('div');
          matchCard.className = `col-md-6 mb-4`;
          matchCard.innerHTML = `
            <div class="card h-100 match-card status-${match.status}">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 class="card-title">${match.homeTeam} vs ${match.awayTeam}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${new Date(match.matchDate).toLocaleDateString()}</h6>
                    <p class="card-text">
                      <strong>Location:</strong> ${match.location}<br>
                      <strong>Status:</strong> <span class="badge bg-${getStatusBadgeColor(match.status)}">${match.status}</span>
                    </p>
                  </div>
                  ${match.status === 'completed' ? `
                    <div class="text-center">
                      <h3 class="mb-0">${match.homeScore} - ${match.awayScore}</h3>
                    </div>
                  ` : ''}
                </div>
              </div>
              <div class="card-footer bg-transparent">
                <button class="btn btn-sm btn-outline-primary me-2 edit-btn" data-id="${match.id}">Edit</button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${match.id}">Delete</button>
              </div>
            </div>
          `;
          matchesList.appendChild(matchCard);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            const matchId = parseInt(this.getAttribute('data-id'));
            editMatch(matchId);
          });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            const matchId = parseInt(this.getAttribute('data-id'));
            if (confirm('Are you sure you want to delete this match?')) {
              deleteMatch(matchId);
            }
          });
        });
      }
      
      // Create new match
      function createMatch(matchData) {
        fetch('/api/matches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(matchData)
        })
          .then(response => response.json())
          .then(data => {
            fetchMatches();
            resetForm();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
      
      // Edit match
      function editMatch(matchId) {
        fetch(`/api/matches/${matchId}`)
          .then(response => response.json())
          .then(match => {
            document.getElementById('matchId').value = match.id;
            document.getElementById('homeTeam').value = match.homeTeam;
            document.getElementById('awayTeam').value = match.awayTeam;
            document.getElementById('matchDate').value = match.matchDate;
            document.getElementById('location').value = match.location;
            document.getElementById('homeScore').value = match.homeScore;
            document.getElementById('awayScore').value = match.awayScore;
            document.getElementById('status').value = match.status;
            
            isEditing = true;
            currentMatchId = matchId;
            submitBtn.textContent = 'Update Match';
            cancelBtn.style.display = 'inline-block';
            formTitle.textContent = 'Edit Match';
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
      
      // Update match
      function updateMatch(matchId, matchData) {
        fetch(`/api/matches/${matchId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(matchData)
        })
          .then(response => response.json())
          .then(data => {
            fetchMatches();
            resetForm();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
      
      // Delete match
      function deleteMatch(matchId) {
        fetch(`/api/matches/${matchId}`, {
          method: 'DELETE'
        })
          .then(() => {
            fetchMatches();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
      
      // Reset form
      function resetForm() {
        matchForm.reset();
        isEditing = false;
        currentMatchId = null;
        submitBtn.textContent = 'Add Match';
        cancelBtn.style.display = 'none';
        formTitle.textContent = 'Add New Match';
      }
      
      // Helper function to get badge color based on status
      function getStatusBadgeColor(status) {
        switch(status) {
          case 'scheduled': return 'secondary';
          case 'ongoing': return 'warning';
          case 'completed': return 'success';
          case 'postponed': return 'danger';
          default: return 'primary';
        }
      }
    });