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
const addDeviceDialogEl = document.querySelector('#mdc-dialog-device');
const addDeviceDialog = new mdc.dialog.MDCDialog(addDeviceDialogEl);
const addDeviceDialogNameTextFieldEl = document.querySelector('.add-device-name-text-field');
const addDeviceDialogNameTextField = new mdc.textField.MDCTextField(addDeviceDialogNameTextFieldEl);
const addDeviceDialogPowerTextFieldEl = document.querySelector('.add-device-power-text-field');
const addDeviceDialogPowerTextField = new mdc.textField.MDCTextField(addDeviceDialogPowerTextFieldEl);
const addDeviceDialogAvgHoursTextFieldEl = document.querySelector('.add-device-avg-hours-text-field');
const addDeviceDialogAvgHoursTextField = new mdc.textField.MDCTextField(addDeviceDialogAvgHoursTextFieldEl);
const noDevicesViewEl = document.querySelector('.no-devices-added');
const deviceTemplateCardCell = document.querySelector('.device-card-template-cell');
const devicesLayoutGridInnerEl = document.querySelector('.devices-layout-grid');
const devicesCardsViewEl = document.querySelector('.device-cards-view');



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
      roomCardClone.querySelector('.room-name').textContent = room.name;
      roomCardClone.querySelector('.room-id').textContent = room.id;
      roomCardClone.querySelector('.room-device-count').textContent = 'This room has 4 devices';
      roomCardClone.classList.remove('room-card-template-cell');
      roomsLayoutGridInnerEl.appendChild(roomCardClone);
    });
    activateCardClickAnimations();
    roomsCardsViewEl.style.display = 'block';
    attachClickListenerToRoomCards();
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
addDeviceFabEl.addEventListener('click', () => addDeviceDialog.open());

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
      deviceCardClone.querySelector('.room-device-count').textContent = 'This room has 4 devices';
      deviceCardClone.classList.remove('device-card-template-cell');
      devicesLayoutGridInnerEl.appendChild(deviceCardClone);
    });
    activateCardClickAnimations();
    devicesCardsViewEl.style.display = 'block';
}

addDeviceDialog.listen('MDCDialog:closing', (ev) => {
    const newDeviceName = addDeviceDialogNameTextField.value.trim();
    const newDevicePowerComsumptionValue = addDeviceDialogPowerTextField.value.trim();
    const newDeviceAvgHours = addDeviceDialogAvgHoursTextField.value.trim();
    const imageEncoding = 0;
    // if the user filled in both fields 
    if (ev.detail.action == 'yes' && newDeviceName != '' && newDevicePowerComsumptionValue != '' && newDeviceAvgHours != '') {
        snackbar.labelText = `New device "${newDeviceName}" added.`
        snackbar.open();
        addNewDeviceForRoomToDb(newDeviceName, newDevicePowerComsumptionValue, newDeviceAvgHours, imageEncoding, currentRoom.id).then((newRowId) => {
            devicesForCurrentRoom.push({"id": newRowId, "name": newDeviceName, "powerConsumption": newDevicePowerComsumptionValue, "avgHours":newDeviceAvgHours, "roomId": currentRoom.id});
            constructDevicesList();
        });
    }
    // if the user left the fields empty
    else if (ev.detail.action == 'yes' && (newDeviceName == '' || newDevicePowerComsumptionValue == '' || newDeviceAvgHours == '')) {
        snackbar.labelText = "All fields are required";
        snackbar.open();
    }
    // empty the text field
    addRoomDialogTextField.value = '';
});

const activateCardClickAnimations = () => {
  const cardSelectors = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action';
  // enable ripple effects on cards
  [].map.call(document.querySelectorAll(cardSelectors), (el) => {
    return new mdc.ripple.MDCRipple(el);
  });
}