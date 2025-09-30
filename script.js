// Political Party Management System
class PartyManager {
    constructor() {
        this.parties = [];
        this.loadParties();
        this.initializeEventListeners();
        this.renderParties();
        this.updatePartyCount();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Form submission
        document.getElementById('partyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createParty();
        });

        // File upload preview
        document.getElementById('partyLogo').addEventListener('change', (e) => {
            this.previewLogo(e);
        });

        // Sort and filter controls
        document.getElementById('sortBy').addEventListener('change', () => {
            this.renderParties();
        });

        document.getElementById('filterIdeology').addEventListener('change', () => {
            this.renderParties();
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('successModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    // Preview uploaded logo
    previewLogo(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('logoPreview');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Logo Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '';
        }
    }

    // Create new party
    createParty() {
        const formData = new FormData(document.getElementById('partyForm'));
        const logoFile = document.getElementById('partyLogo').files[0];
        
        const party = {
            id: Date.now(),
            name: document.getElementById('partyName').value.trim(),
            slogan: document.getElementById('partySlogan').value.trim(),
            description: document.getElementById('partyDescription').value.trim(),
            color: document.getElementById('partyColor').value,
            ideology: document.getElementById('partyIdeology').value,
            founder: document.getElementById('founderName').value.trim(),
            logo: null,
            supports: 0,
            createdAt: new Date().toISOString()
        };

        // Handle logo upload
        if (logoFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                party.logo = e.target.result;
                this.saveParty(party);
            };
            reader.readAsDataURL(logoFile);
        } else {
            this.saveParty(party);
        }
    }

    // Save party and update UI
    saveParty(party) {
        this.parties.unshift(party); // Add to beginning of array
        this.saveParties();
        this.renderParties();
        this.updatePartyCount();
        this.resetForm();
        this.showSuccessModal();
    }

    // Reset form after submission
    resetForm() {
        document.getElementById('partyForm').reset();
        document.getElementById('logoPreview').innerHTML = '';
        document.getElementById('partyColor').value = '#2c5aa0';
    }

    // Show success modal
    showSuccessModal() {
        document.getElementById('successModal').style.display = 'block';
        setTimeout(() => {
            this.closeModal();
        }, 3000); // Auto close after 3 seconds
    }

    // Close modal
    closeModal() {
        document.getElementById('successModal').style.display = 'none';
    }

    // Load parties from localStorage
    loadParties() {
        // Force update - clear ALL data and recreate with new settings
        localStorage.clear();
        this.createSampleParties();
    }

    // Save parties to localStorage
    saveParties() {
        localStorage.setItem('politicalParties', JSON.stringify(this.parties));
    }

    // Create serious sample parties for demonstration
    createSampleParties() {
        const sampleParties = [
            {
                id: 1,
                name: "Progressive Democratic Alliance",
                slogan: "Progress Through Unity",
                description: "The Progressive Democratic Alliance advocates for comprehensive social reform, environmental sustainability, and economic equality. Our platform includes universal healthcare, progressive taxation, renewable energy transition, and strengthening democratic institutions.",
                color: "#2563eb",
                ideology: "Social Democracy",
                founder: "Elizabeth Warren",
                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/DemocraticLogo.svg/200px-DemocraticLogo.svg.png",
                supports: 3,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Conservative Unity Party",
                slogan: "Tradition, Freedom, Prosperity",
                description: "The Conservative Unity Party champions traditional values, free market economics, and limited government. We believe in fiscal responsibility, strong defense, constitutional originalism, and preserving our nation's founding principles.",
                color: "#dc2626",
                ideology: "Conservatism",
                founder: "Robert Thompson",
                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Republicanlogo.svg/200px-Republicanlogo.svg.png",
                supports: 5,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: "Green Future Coalition",
                slogan: "Sustainability for Tomorrow",
                description: "The Green Future Coalition prioritizes environmental protection, climate action, and sustainable development. Our comprehensive green new deal includes renewable energy investment, carbon neutrality goals, and environmental justice initiatives.",
                color: "#16a34a",
                ideology: "Green Politics",
                founder: "Dr. Maria Rodriguez",
                logo: "https://img.icons8.com/color/96/000000/leaf.png",
                supports: 2,
                createdAt: new Date().toISOString()
            }
        ];
        
        this.parties = sampleParties;
        this.saveParties();
    }

    // Support a party
    supportParty(partyId) {
        const party = this.parties.find(p => p.id === partyId);
        if (party) {
            party.supports++;
            this.saveParties();
            this.renderParties();
            
            // Add visual feedback
            const button = document.querySelector(`[data-party-id="${partyId}"]`);
            if (button) {
                button.innerHTML = '<i class="fas fa-check"></i> Supported';
                button.style.backgroundColor = '#22c55e';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-hand-paper"></i> Support';
                    button.style.backgroundColor = '';
                }, 1500);
            }
        }
    }

    // Get filtered and sorted parties
    getFilteredParties() {
        let filtered = [...this.parties];
        
        // Filter by ideology
        const ideologyFilter = document.getElementById('filterIdeology').value;
        if (ideologyFilter !== 'all') {
            filtered = filtered.filter(party => party.ideology === ideologyFilter);
        }
        
        // Sort parties
        const sortBy = document.getElementById('sortBy').value;
        switch (sortBy) {
            case 'recent':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'popular':
                filtered.sort((a, b) => b.supports - a.supports);
                break;
            case 'alphabetical':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        
        return filtered;
    }

    // Render all parties
    renderParties() {
        const grid = document.getElementById('partiesGrid');
        const parties = this.getFilteredParties();
        
        if (parties.length === 0) {
            grid.innerHTML = `
                <div class="no-parties">
                    <i class="fas fa-vote-yea"></i>
                    <p>No political parties found.</p>
                    <p>Create a new party or adjust the filter criteria.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = parties.map(party => this.createPartyCard(party)).join('');
        
        // Add event listeners to support buttons
        grid.querySelectorAll('.support-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const partyId = parseInt(e.target.dataset.partyId);
                this.supportParty(partyId);
            });
        });
    }

    // Create party card HTML
    createPartyCard(party) {
        const logoHtml = party.logo 
            ? `<img src="${party.logo}" alt="Logo of ${party.name}" class="party-logo">`
            : `<div class="party-logo" style="background: ${party.color}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">${party.name.charAt(0)}</div>`;
        
        const createdDate = new Date(party.createdAt).toLocaleDateString('en-US');
        
        return `
            <div class="party-card" style="--party-color: ${party.color}; border-left-color: ${party.color};">
                <div class="party-header">
                    ${logoHtml}
                    <div class="party-info">
                        <h3>${this.escapeHtml(party.name)}</h3>
                        <p class="party-slogan">"${this.escapeHtml(party.slogan)}"</p>
                    </div>
                </div>
                
                <div class="party-details">
                    <p class="party-description">${this.escapeHtml(party.description)}</p>
                    
                    <div class="party-meta">
                        <div class="meta-item">
                            <i class="fas fa-user-tie"></i>
                            <span>Leader: ${this.escapeHtml(party.founder)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-balance-scale"></i>
                            <span>${party.ideology}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Founded: ${createdDate}</span>
                        </div>
                    </div>
                </div>
                
                <div class="party-footer">
                    <div class="support-count">
                        <i class="fas fa-users"></i>
                        <span>${party.supports} supporters</span>
                    </div>
                    <button class="support-btn" data-party-id="${party.id}">
                        <i class="fas fa-hand-paper"></i>
                        Support
                    </button>
                </div>
            </div>
        `;
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Update party count
    updatePartyCount() {
        const count = this.parties.length;
        document.getElementById('partyCount').textContent = `(${count})`;
    }

    // Clear all parties (for development/testing)
    clearAllParties() {
        if (confirm('Are you sure you want to delete all parties?')) {
            this.parties = [];
            localStorage.removeItem('politicalParties');
            this.createSampleParties();
            this.renderParties();
            this.updatePartyCount();
        }
    }
}

// Initialize the party manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.partyManager = new PartyManager();
}); 