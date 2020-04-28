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
const roomsListViewEl = document.querySelector('.rooms-list-view');
const roomsListEl = document.querySelector('.rooms-list');
const roomsListView = new mdc.list.MDCList(roomsListEl);
const noRoomsViewEl = document.querySelector('.no-rooms-added');
const roomTemplateCard = document.querySelector('.room-card-template');

const addDeviceFabEl = document.querySelector('.add-device-fab');
const addDeviceDialogEl = document.querySelector('#mdc-dialog-device');
const addDeviceDialog = new mdc.dialog.MDCDialog(addDeviceDialogEl);
const addDeviceDialogNameTextFieldEl = document.querySelector('.add-device-name-text-field');
const addDeviceDialogNameTextField = new mdc.textField.MDCTextField(addDeviceDialogNameTextFieldEl);
const addDeviceDialogPowerTextFieldEl = document.querySelector('.add-device-power-text-field');
const addDeviceDialogPowerTextField = new mdc.textField.MDCTextField(addDeviceDialogPowerTextFieldEl);
const addDeviceDialogAvgHoursTextFieldEl = document.querySelector('.add-device-avg-hours-text-field');
const addDeviceDialogAvgHoursTextField = new mdc.textField.MDCTextField(addDeviceDialogAvgHoursTextFieldEl);
const devicesListViewEl = document.querySelector('.devices-list-view');
const devicesListEl = document.querySelector('.devices-list');
const devicesListView = new mdc.list.MDCList(devicesListViewEl);
const noDevicesViewEl = document.querySelector('.no-devices-added');
const cardSelectors = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action';
// enable ripple effects on cards
[].map.call(document.querySelectorAll(cardSelectors), (el) => {
  return new mdc.ripple.MDCRipple(el);
});
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
    roomsListEl.textContent = '';
    rooms.map((room) => {
      let roomCardClone = roomTemplateCard.cloneNode(true);
      roomCardClone.querySelector('.room-name').textContent = room.name;
      roomCardClone.querySelector('.room-id').textContent = `Room # ${room.id}`;
      roomCardClone.querySelector('.room-device-count').textContent = 'This room has 4 devices';
      roomsListViewEl.appendChild(roomCardClone);

    });
    roomsListViewEl.style.display = 'block';
//     attachClickListenerToRoomsList();
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

const attachClickListenerToRoomsList = () => {
    if(roomsListView.listElements.length != 0) {
        roomsListView.listElements.forEach((item) => {
            const roomId = item.querySelector('#room-id').textContent;
            const roomObj = rooms.find(room => room.id == roomId);
            item.addEventListener('click', () => {
                console.log(`Clicked on room ${roomId}`);
                goToRoomPage(roomObj);
            });
        });
    }
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
    // hide the no rooms view
    noDevicesViewEl.style.display = 'none';
    // clear the rooms list first
    devicesListEl.textContent = '';
    for(let device of devicesForCurrentRoom) {
        let li = document.createElement('li');
        li.classList.add('mdc-list-item');
        let icon = document.createElement('i');
        icon.classList.add('material-icons');
        icon.textContent = "meeting_room";
        let iconSpan = document.createElement('span');
        iconSpan.classList.add('mdc-list-item__graphic');
        let spanText = document.createElement('span');
        spanText.classList.add('mdc-list-item__text');
        let spanTextPri = document.createElement('span');
        spanTextPri.classList.add('mdc-list-item__primary-text');
        spanTextPri.textContent = device.name;
        let spanTextSec = document.createElement('span');
        spanTextSec.classList.add('mdc-list-item__secondary-text');
        spanTextSec.setAttribute('id', 'room-id');
        spanTextSec.textContent = device.powerConsumption;
        li.appendChild(iconSpan);
        iconSpan.appendChild(icon);
        spanText.appendChild(spanTextPri);
        spanText.appendChild(spanTextSec);
        li.appendChild(spanText);
        devicesListEl.appendChild(li);
    }
    devicesListViewEl.style.display = 'block';
//     attachClickListenerToRoomsList();
}

addDeviceDialog.listen('MDCDialog:closing', (ev) => {
    const newDeviceName = addDeviceDialogNameTextField.value.trim();
    const newDevicePowerComsumptionValue = addDeviceDialogPowerTextField.value.trim();
    const imageEncoding = 0;
    // if the user filled in both fields 
    if (ev.detail.action == 'yes' && newDeviceName != '' && newDevicePowerComsumptionValue != '') {
        snackbar.labelText = `New device "${newDeviceName}" added.`
        snackbar.open();
        addNewDeviceForRoomToDb(newDeviceName, newDevicePowerComsumptionValue, imageEncoding, currentRoom.id).then((newRowId) => {
            devicesForCurrentRoom.push({"id": newRowId, "name": newDeviceName, "powerConsumption": newDevicePowerComsumptionValue, "roomId": currentRoom.id});
            constructDevicesList();
        });
    }
    // if the user left the room name empty
    else if (ev.detail.action == 'yes' && (newDeviceName == '' || newDevicePowerComsumptionValue == '')) {
        snackbar.labelText = "All fields are required";
        snackbar.open();
    }
    // empty the text field
    addRoomDialogTextField.value = '';
});