document.addEventListener('DOMContentLoaded', () => {
  function doomLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`%c[${timestamp}] DOOM SYSTEM: ${message}`, 'color: #ff4500; font-weight: bold;');
  }

  doomLog("Arsenal selection system initialized.");

  const weaponsData = [
    {
      name: 'Super Shotgun',
      image: 'public/Super_Shotgun.png',
      damage: 'High',
      ammo: 'Shells',
      type: 'Shotgun',
      description: 'A classic double-barreled shotgun. Devastating at close range.'
    },
    {
      name: 'Plasma Rifle',
      image: 'public/PlasmaRifle.png',
      damage: 'Medium',
      ammo: 'Plasma Cells',
      type: 'Energy Rifle',
      description: 'Fires rapid-fire plasma projectiles. Excellent for crowd control.'
    },
    {
      name: 'Rocket Launcher',
      image: 'public/RocketLauncher.png',
      damage: 'Very High',
      ammo: 'Rockets',
      type: 'Explosive',
      description: 'Launches high-explosive rockets. Deals massive area-of-effect damage.'
    }
  ];

  const weaponGrid = document.getElementById('weapon-grid');
  const weaponDetails = document.getElementById('weapon-details');
  const continueButton = document.getElementById('continue-to-creation');
  const weaponCardTemplate = document.getElementById('weapon-card-template');
  let selectedWeapon = null;

  /**
   * Creates a weapon card element from a weapon object using a template.
   * @param {object} weapon - The weapon data object.
   * @returns {DocumentFragment} A fragment containing the created weapon card.
   */
  function createWeaponCard(weapon) {
    // Clone the template's content. True for a deep clone.
    const cardClone = weaponCardTemplate.content.cloneNode(true);
    const weaponCard = cardClone.querySelector('.weapon-card');
    const weaponImg = cardClone.querySelector('img');
    const weaponNameP = cardClone.querySelector('p');

    // Populate the cloned elements with data
    weaponCard.dataset.weaponName = weapon.name;
    weaponImg.src = weapon.image;
    weaponImg.alt = weapon.name;
    weaponNameP.textContent = weapon.name;

    return cardClone;
  }

  /**
   * Populates the weapon grid efficiently using a DocumentFragment and templates.
   */
  function createWeaponGrid() {
    // Clear any existing content
    weaponGrid.innerHTML = '';
    // Use a DocumentFragment to batch DOM manipulations for better performance
    const fragment = document.createDocumentFragment();

    weaponsData.forEach(weapon => {
      const card = createWeaponCard(weapon);
      fragment.appendChild(card);
    });

    // Append the entire fragment to the live DOM in a single operation
    weaponGrid.appendChild(fragment);
  }

  /**
   * Updates the details panel with the selected weapon's information.
   * @param {object} weapon - The weapon object to display.
   */
  function updateWeaponDetails(weapon) {
    // Clear previous details and build new ones programmatically
    weaponDetails.innerHTML = '';
    const detailsImg = document.createElement('img');
    detailsImg.src = weapon.image;
    detailsImg.alt = weapon.name;
    detailsImg.className = 'selected-weapon-img';

    const detailsHeader = document.createElement('h4');
    detailsHeader.textContent = weapon.name;

    const detailsType = document.createElement('p');
    detailsType.innerHTML = `<strong>Type:</strong> ${weapon.type}`;

    const detailsDamage = document.createElement('p');
    detailsDamage.innerHTML = `<strong>Damage:</strong> ${weapon.damage}`;

    const detailsAmmo = document.createElement('p');
    detailsAmmo.innerHTML = `<strong>Ammo:</strong> ${weapon.ammo}`;

    const detailsDesc = document.createElement('p');
    detailsDesc.textContent = weapon.description;

    weaponDetails.appendChild(detailsImg);
    weaponDetails.appendChild(detailsHeader);
    weaponDetails.appendChild(detailsType);
    weaponDetails.appendChild(detailsDamage);
    weaponDetails.appendChild(detailsAmmo);
    weaponDetails.appendChild(detailsDesc);
  }

  function handleWeaponSelection(event) {
    const clickedCard = event.target.closest('.weapon-card');

    // If the click was outside a weapon card, do nothing
    if (!clickedCard) {
      return;
    }

    const weaponName = clickedCard.dataset.weaponName;
    const weapon = weaponsData.find(w => w.name === weaponName);

    if (weapon) {
      doomLog(`Weapon selected: ${weapon.name}`);
      selectedWeapon = weapon;

      // Provide visual feedback by updating the selected class
      document.querySelectorAll('.weapon-card').forEach(card => card.classList.remove('selected'));
      clickedCard.classList.add('selected');

      // Update the details panel
      updateWeaponDetails(weapon);
    }
  }

  if (weaponGrid && weaponDetails && continueButton) {
    // Populate the weapon grid
    createWeaponGrid();

    // Use event delegation for handling clicks on any weapon card
    weaponGrid.addEventListener('click', handleWeaponSelection);

    // Set up the continue button
    continueButton.addEventListener('click', () => {
      if (selectedWeapon) {
        doomLog(`Confirming selection: ${selectedWeapon.name}. Proceeding to creation.`);
        sessionStorage.setItem('selectedWeapon', JSON.stringify(selectedWeapon));
        window.location.href = 'create.html';
      } else {
        alert("You must choose a weapon to proceed, Slayer!");
      }
    });
  }
});