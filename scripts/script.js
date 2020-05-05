const topAppBarTitleEl = document.querySelector('#top-app-bar-title');
const snackbarEl = document.querySelector('.mdc-snackbar');
const snackbar = new mdc.snackbar.MDCSnackbar(snackbarEl);



const mainRoomsListViewEl = document.querySelector('.main-rooms-list-view');
const mainRoomViewEl = document.querySelector('.main-room-view');
const addRoomFabEl = document.querySelector('.add-room-fab');
mdc.ripple.MDCRipple.attachTo(addRoomFabEl);
const addRoomDialogEl = document.querySelector('#mdc-dialog-room');
const addRoomDialog = new mdc.dialog.MDCDialog(addRoomDialogEl);
const addRoomDialogTextFieldEl = document.querySelector('.add-room-text-field');
const addRoomDialogTextField = new mdc.textField.MDCTextField(addRoomDialogTextFieldEl);
const noRoomsViewEl = document.querySelector('.no-rooms-added');
const roomTemplateCardCell = document.querySelector('.room-card-template-cell');
const roomsLayoutGridInnerEl = document.querySelector('.rooms-layout-grid');
const roomsCardsViewEl = document.querySelector('.rooms-cards-view');


const addDeviceFabEl = document.querySelector('.add-device-fab');
const addDeviceNameTextFieldEl = document.querySelector('.add-device-name-text-field');
const addDeviceNameTextField = new mdc.textField.MDCTextField(addDeviceNameTextFieldEl);
const addDevicePowerTextFieldEl = document.querySelector('.add-device-power-text-field');
const addDevicePowerTextField = new mdc.textField.MDCTextField(addDevicePowerTextFieldEl);
const addDeviceAvgHoursTextFieldEl = document.querySelector('.add-device-avg-hours-text-field');
const addDeviceAvgHoursTextField = new mdc.textField.MDCTextField(addDeviceAvgHoursTextFieldEl);
const addDeviceSearchTextFieldEl = document.querySelector('.add-device-search-text-field');
const addDeviceSearchTextField = new mdc.textField.MDCTextField(addDeviceSearchTextFieldEl);
const customPowerConsumptionRadioEl = document.querySelector('#custom-power-consumption-radio');
const searchPowerConsumptionRadioEl = document.querySelector('#search-power-consumption-radio');
const addNewDeviceBtnEl = document.querySelector('.add-new-device-btn');
new mdc.ripple.MDCRipple.attachTo(addNewDeviceBtnEl);
const cancelNewDeviceBtnEl = document.querySelector('.cancel-new-device-btn');
new mdc.ripple.MDCRipple.attachTo(cancelNewDeviceBtnEl);
const deviceSearchResultsDialogEl = document.querySelector('#mdc-dialog-device-search');
const deviceSearchResultsDialog = new mdc.dialog.MDCDialog(deviceSearchResultsDialogEl);
const deviceSearchResultsList = document.querySelector('.device-search-results');
const deviceSearchResultItemTemplate = document.querySelector('.device-search-result-item-template');
const deviceSearchBtnEl = document.querySelector('.device-search-btn');
const noDeviceSearchResultsFoundEl = document.querySelector('.no-device-search-results');
const noDevicesViewEl = document.querySelector('.no-devices-added');
const deviceTemplateCardCell = document.querySelector('.device-card-template-cell');
const devicesLayoutGridInnerEl = document.querySelector('.devices-layout-grid');
const devicesCardsViewEl = document.querySelector('.devices-cards-view');

const mainAddDeviceView = document.querySelector('.add-device-view');


const activateCardClickAnimations = () => {
  const cardSelectors = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action';
  // enable ripple effects on cards
  [].map.call(document.querySelectorAll(cardSelectors), (el) => {
    return new mdc.ripple.MDCRipple(el);
  });
}

let rooms = []; // holds the all the rooms 
let currentRoom = {}; // holds the current room on the page
let devicesForCurrentRoom = []; // holds the devices for the current room
getAllRoomsFromDb().then(data => {
    rooms = data; // reassign to local var
    if (rooms.length > 0) {
        noRoomsViewEl.style.display = 'none';
        constructRoomsList();
    }
    else {
        noRoomsViewEl.style.display = 'block';
    }
});

const constructRoomsList = () => {
    // hide the no rooms view
    noRoomsViewEl.style.display = 'none';
    // clear the rooms list first
    roomsLayoutGridInnerEl.textContent = '';
    rooms.map((room) => {
      let roomCardClone = roomTemplateCardCell.cloneNode(true);
      let deviceCount = 0;
      getDeviceCountForRoomFromDb(room.id).then(data => {
        deviceCount = data;
        roomCardClone.querySelector('.room-name').textContent = room.name;
        roomCardClone.querySelector('.room-id').textContent = room.id;
        roomCardClone.querySelector('.room-device-count').textContent = (deviceCount == 1) ? `${deviceCount} device` : `${deviceCount} devices`;
        roomCardClone.classList.remove('room-card-template-cell');
        roomsLayoutGridInnerEl.appendChild(roomCardClone);
        activateCardClickAnimations();
        roomsCardsViewEl.style.display = 'block';
        attachClickListenerToRoomCards();
      });
    });
}
addRoomFabEl.addEventListener('click', () => addRoomDialog.open());

addRoomDialog.listen('MDCDialog:closing', (ev) => {
    const newRoomName = addRoomDialogTextField.value.trim();
    // if the user filled in a name 
    if (ev.detail.action == 'yes' && newRoomName != '') {
        snackbar.labelText = `New room "${newRoomName}" added.`
        snackbar.open();
        addNewRoomToDb(newRoomName).then((newRowId) => {
            rooms.push({"name": newRoomName, id: newRowId});
            constructRoomsList();
        });
    }
    // if the user left the room name empty
    else if (ev.detail.action == 'yes' && newRoomName == '') {
        snackbar.labelText = "Room name can't be empty";
        snackbar.open();
    }
    // empty the text field
    addRoomDialogTextField.value = '';
});

const attachClickListenerToRoomCards = () => {
  const roomCards = document.querySelectorAll('.room-card');
  roomCards.forEach((item) => {
    const viewRoomBtnEl = item.querySelector('.mdc-button');
    const roomId = item.querySelector('.room-id').textContent;
    const roomObj = rooms.find(room => room.id == roomId);
    viewRoomBtnEl.addEventListener('click', () => {
        console.log(`Clicked on room ${roomId}`);
        goToRoomPage(roomObj);
    });
  });
}
const goToRoomPage = (roomObj) => {
    mainRoomsListViewEl.style.display = 'none';
    mainRoomViewEl.style.display = 'block';
    currentRoom = roomObj;
    topAppBarTitleEl.textContent = roomObj.name;
    getDevicesForRoomFromDb(roomObj.id).then(data => {
      devicesForCurrentRoom = data; // reassign to local var
      if(devicesForCurrentRoom.length > 0) {
        constructDevicesList();
      }
      else {
        noDevicesViewEl.style.display = 'block';
      }
    });
}
addDeviceFabEl.addEventListener('click', () =>  {
  mainRoomViewEl.style.display = 'none';
  mainAddDeviceView.style.display = 'block';
  topAppBarTitleEl.textContent = "Add a new device";
  document.querySelector('#new-device-room-name').textContent = currentRoom.name;
});

const constructDevicesList = () => {
   // hide the no devices view
    noDevicesViewEl.style.display = 'none';
    // clear the devices list first
    devicesLayoutGridInnerEl.textContent = '';
    devicesForCurrentRoom.map((device) => {
      let deviceCardClone = deviceTemplateCardCell.cloneNode(true);
      deviceCardClone.querySelector('.device-name').textContent = device.name;
      deviceCardClone.querySelector('.device-power-consumption').textContent = device.powerConsumption;
      deviceCardClone.querySelector('.device-avg-hours').textContent = device.avgHours;
      deviceCardClone.querySelector('.device-estimated-cost-hourly').textContent = calculateEnergyCost(device.powerConsumption, 1, currentEnergyPrice);
      deviceCardClone.querySelector('.device-estimated-cost').textContent = calculateEnergyCost(device.powerConsumption, device.avgHours, currentEnergyPrice);
      deviceCardClone.classList.remove('device-card-template-cell');
      devicesLayoutGridInnerEl.appendChild(deviceCardClone);
    });
    activateCardClickAnimations();
    devicesCardsViewEl.style.display = 'block';
}
cancelNewDeviceBtnEl.addEventListener('click', () => {
  mainAddDeviceView.style.display = 'none';
  mainRoomViewEl.style.display = 'block';
  constructDevicesList();
});
addNewDeviceBtnEl.addEventListener('click', () => {
  const newDeviceName = addDeviceNameTextField.value.trim();
  const newDevicePowerComsumptionValue = addDevicePowerTextField.value.trim();
  const newDeviceAvgHours = addDeviceAvgHoursTextField.value.trim();
  const imageEncoding = 0;
  
  // if the user filled in all fields 
  if (newDeviceName != '' && newDevicePowerComsumptionValue != '' && newDeviceAvgHours != '') {
      if(!addDeviceAvgHoursTextField.valid) {
        snackbar.labelText = "Hours of use must be a number between 0 and 24 hours!";
        snackbar.open();
        return;
      }
      if(!addDevicePowerTextField.valid) {
        snackbar.labelText = "Device power consumption must be a number greater than 1!";
        snackbar.open();
        return;
      }
      snackbar.labelText = `New device "${newDeviceName}" added.`
      snackbar.open();
      addNewDeviceForRoomToDb(newDeviceName, newDevicePowerComsumptionValue, newDeviceAvgHours, imageEncoding, currentRoom.id).then((newRowId) => {
        devicesForCurrentRoom.push({"id": newRowId, "name": newDeviceName, "powerConsumption": newDevicePowerComsumptionValue, "avgHours":newDeviceAvgHours, "roomId": currentRoom.id});
        mainAddDeviceView.style.display = 'none';
        mainRoomViewEl.style.display = 'block';
        constructDevicesList();
        // empty the text fields
        addDeviceNameTextField.value = '';
        addDevicePowerTextField.value = '';
        addDeviceAvgHoursTextField.value = '';
        
        // reset the app bar title
        topAppBarTitleEl.textContent = currentRoom.name;
      });
      
  }
  // if the user left the fields empty
  else if (newDeviceName == '' || newDevicePowerComsumptionValue == '' || newDeviceAvgHours == '') {
      snackbar.labelText = "All fields are required";
      snackbar.open();
  }
});

// enable enter key on the add device form
[addDeviceNameTextFieldEl, addDevicePowerTextFieldEl, addDeviceAvgHoursTextFieldEl].forEach((inputField) => {
  inputField.addEventListener("keyup", (ev) => {
    // if enter key
    if(ev.keyCode === 13) {
      ev.preventDefault();
      addNewDeviceBtnEl.click();
    }
  });
});
// enable enter key on search device field
addDeviceSearchTextFieldEl.addEventListener('keyup', (ev) => {
  if (ev.keyCode === 13 && addDeviceSearchTextField.value.trim() != '') {
    ev.preventDefault();
    searchForDeviceDialog(addDeviceSearchTextField.value.trim());
  }
});

// setup power consumption radio btns
[customPowerConsumptionRadioEl, searchPowerConsumptionRadioEl].forEach((radio) => {
  radio.addEventListener('change', () => {
    if (radio == customPowerConsumptionRadioEl) {
      addDeviceSearchTextFieldEl.style.display = 'none';
      addDevicePowerTextFieldEl.style.display = 'inline-flex';
    }
    else {
      addDeviceSearchTextFieldEl.style.display = 'inline-flex';
      addDevicePowerTextFieldEl.style.display = 'none';
    }
  });
});
deviceSearchBtnEl.addEventListener('click' ,() => {
  if(addDeviceSearchTextField.value.trim() != '') {
    searchForDeviceDialog(addDeviceSearchTextField.value.trim());
  }
});

const searchForDeviceDialog = (query) => {
  deviceSearchResultsDialog.open();
  let results = [];
  const searchResults = searchForDevice(query)
    .then(data => {
      deviceSearchResultsList.textContent = '';
      data.map(d => results.push(...d));
      filteredResults = filterDevicesWithPowerConsumptionStats(results);
      if (filteredResults.length <= 0) {
        noDeviceSearchResultsFoundEl.style.display = 'block';
      }
      else {
        noDeviceSearchResultsFoundEl.style.display = 'none';
        filteredResults.map(result => {
          let listItem = deviceSearchResultItemTemplate.cloneNode(true);
          listItem.querySelector('.device-name').textContent = `${result.brand_name} ${result.model_name || result.model_number}`;
          listItem.querySelector('#device-power-consumption').textContent = result.powerConsumption;
          listItem.classList.remove('device-search-result-item-template');
          deviceSearchResultsList.appendChild(listItem);
        });
        attachClickListenerToDeviceSearchResults();
      }
  });
}
const attachClickListenerToDeviceSearchResults = () => {
  const deviceSearchResultListItemEls = document.querySelectorAll('.device-search-result-item');
  deviceSearchResultListItemEls.forEach((item) => {
    item.addEventListener('click', () => {
      const currentDevicePowerConsumption  = item.querySelector('#device-power-consumption').textContent;
      const currentDeviceName = item.querySelector('.device-name').textContent; 
      if(!addDeviceNameTextFieldEl.value || addDeviceNameTextFieldEl.value == '') {
        addDeviceNameTextField.value = currentDeviceName;
      }
      addDeviceSearchTextFieldEl.style.display = 'none';
      addDevicePowerTextFieldEl.style.display = 'inline-flex';
      addDevicePowerTextField.value = currentDevicePowerConsumption;
      deviceSearchResultsDialog.close();
    });
  });  
}
