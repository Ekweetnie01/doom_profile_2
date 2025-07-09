class ProfileManager {
  constructor() {
    this.storageKey = 'doomSlayerProfiles';
    this.autoSaveKey = 'doomSlayerAutoSave';

    this.dom = {
      // Profile management section
      profileNameInput: document.getElementById('profile-name'),
      saveBtn: document.getElementById('save-profile'),
      loadBtn: document.getElementById('load-profile'),
      deleteBtn: document.getElementById('delete-profile'),
      profileSelector: document.getElementById('profile-selector'),
      profilesList: document.getElementById('profiles-list'),
      previewContent: document.getElementById('preview-content'),

      // Form elements to save/load
      form: document.querySelector('.container.card form'),
      slayerNameInput: document.getElementById('name'),
      ageRadios: document.querySelectorAll('input[name="age"]'),
      genderSelect: document.getElementById('gender'),
      bioTextarea: document.getElementById('bio'),
      displayWeapon: document.getElementById('display-weapon'),
    };
    
    this.initializeEventListeners();
    this.populateProfileList();
    this.checkForAutoSave();
    this.setupAutoSave();
  }

  initializeEventListeners() {
    this.dom.saveBtn.addEventListener('click', () => {
      const profileName = this.dom.profileNameInput.value.trim();
      this.saveProfile(profileName);
    });
    this.dom.loadBtn.addEventListener('click', () => this.loadProfile());
    this.dom.deleteBtn.addEventListener('click', () => this.deleteProfile());
    this.dom.profileSelector.addEventListener('change', (e) => this.previewProfile(e.target.value));
  }

  getProfiles() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || {};
  }
  
  saveProfiles(profiles) {
    localStorage.setItem(this.storageKey, JSON.stringify(profiles));
  }

  getCurrentFormData() {
    const selectedAge = document.querySelector('input[name="age"]:checked');
    const selectedWeapon = JSON.parse(sessionStorage.getItem('selectedWeapon'));

    return {
      slayerName: this.dom.slayerNameInput.value,
      age: selectedAge ? selectedAge.value : null,
      gender: this.dom.genderSelect.value,
      bio: this.dom.bioTextarea.value,
      weapon: selectedWeapon,
      stats: window.statsManager ? window.statsManager.currentStats : null,
    };
  }

  validateProfileData(data, profileName) {
    const errors = [];
    if (!profileName) {
      errors.push('Profile name cannot be empty.');
    }
    if (!data.slayerName) {
      errors.push("Slayer's name cannot be empty.");
    }
    if (!data.age) {
      errors.push('An age must be selected.');
    }
    if (!data.weapon) {
      errors.push('A weapon must be selected from the arsenal.');
    }
    return { isValid: errors.length === 0, errors };
  }

  saveProfile(profileName) {
    const profileData = this.getCurrentFormData();
    const validation = this.validateProfileData(profileData, profileName);

    if (!validation.isValid) {
      alert(`Error saving profile:\n- ${validation.errors.join('\n- ')}`);
      return;
    }

    const profiles = this.getProfiles();
    profiles[profileName] = {
      ...profileData,
      savedAt: new Date().toISOString(), // Add timestamp
    };
    this.saveProfiles(profiles);

    alert(`Profile "${profileName}" saved successfully!`);
    this.dom.profileNameInput.value = '';
    this.populateProfileList();
  }

  loadProfile() {
    const profileName = this.dom.profileSelector.value;
    if (!profileName) {
      alert('Please select a profile to load.');
      return;
    }

    const profiles = this.getProfiles();
    const profileData = profiles[profileName];

    if (profileData) {
      this.populateForm(profileData);
      alert(`Profile "${profileName}" loaded!`);
    }
  }

  populateForm(data) {
    this.dom.slayerNameInput.value = data.slayerName;
    this.dom.genderSelect.value = data.gender;
    this.dom.bioTextarea.value = data.bio;
    this.dom.displayWeapon.textContent = data.weapon ? data.weapon.name : 'None Selected';

    sessionStorage.setItem('selectedWeapon', JSON.stringify(data.weapon));

    const ageRadio = document.querySelector(`input[name="age"][value="${data.age}"]`);
    if (ageRadio) {
      ageRadio.checked = true;
      // Dispatch event to trigger stat updates
      ageRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  deleteProfile() {
    const profileName = this.dom.profileSelector.value;
    if (!profileName) {
      alert('Please select a profile to delete.');
      return;
    }

    if (confirm(`Are you sure you want to delete the profile "${profileName}"? This cannot be undone.`)) {
      const profiles = this.getProfiles();
      delete profiles[profileName];
      this.saveProfiles(profiles);
      this.populateProfileList();
      this.previewProfile(''); // Clear preview
      alert(`Profile "${profileName}" has been deleted.`);
    }
  }

  populateProfileList() {
    const profiles = this.getProfiles();
    const profileNames = Object.keys(profiles);

    this.dom.profileSelector.innerHTML = '<option value="">Select a profile...</option>';
    this.dom.profilesList.innerHTML = '';

    if (profileNames.length === 0) {
      this.dom.profilesList.textContent = 'No profiles saved yet.';
      this.previewProfile('');
      return;
    }

    profileNames.forEach(name => {
      const profile = profiles[name];
      const savedDate = new Date(profile.savedAt).toLocaleString();

      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      this.dom.profileSelector.appendChild(option);

      const p = document.createElement('p');
      p.innerHTML = `<strong>${name}</strong> <small>(Saved: ${savedDate})</small>`;
      this.dom.profilesList.appendChild(p);
    });
  }

  previewProfile(profileName) {
    if (!profileName) {
      this.dom.previewContent.innerHTML = 'Select a profile to preview';
      return;
    }

    const profiles = this.getProfiles();
    const data = profiles[profileName];
    const savedDate = new Date(data.savedAt).toLocaleString();

    this.dom.previewContent.innerHTML = `
      <p><strong>Name:</strong> ${data.slayerName}</p>
      <p><strong>Weapon:</strong> ${data.weapon ? data.weapon.name : 'N/A'}</p>
      <p><strong>Age Group:</strong> ${data.age}</p>
      <p><strong>Stats:</strong> Str ${data.stats.strength}, Spd ${data.stats.speed}, Exp ${data.stats.experience}</p>
      <p class="bio">"${data.bio || 'No bio provided.'}"</p>
      <p><small>Saved: ${savedDate}</small></p>
    `;
  }

  setupAutoSave() {
    setInterval(() => {
      const data = this.getCurrentFormData();
      // Only auto-save if there's something to save
      if (data.slayerName || data.bio) {
        localStorage.setItem(this.autoSaveKey, JSON.stringify(data));
      }
    }, 5000); // Auto-save every 5 seconds
  }

  checkForAutoSave() {
    const autoSavedData = localStorage.getItem(this.autoSaveKey);
    if (autoSavedData) {
      if (confirm('Unsaved changes found. Would you like to restore them?')) {
        this.populateForm(JSON.parse(autoSavedData));
      }
      // Clear the auto-save data regardless of user choice
      localStorage.removeItem(this.autoSaveKey);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.profileManager = new ProfileManager();
});