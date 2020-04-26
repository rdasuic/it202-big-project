const addRoomFabEl = document.querySelector('.add-room-fab');
mdc.ripple.MDCRipple.attachTo(addRoomFabEl);
const addRoomDialogEl = document.querySelector('#mdc-dialog-room');
const addRoomDialog = new mdc.dialog.MDCDialog(addRoomDialogEl);
const addRoomDialogTextFieldEl = document.querySelector('.add-room-text-field');
const addRoomDialogTextField = new mdc.textField.MDCTextField(addRoomDialogTextFieldEl);
const snackbarEl = document.querySelector('.mdc-snackbar');
const snackbar = new mdc.snackbar.MDCSnackbar(snackbarEl);
const roomsListViewEl = document.querySelector('.rooms-list-view');
const roomsListEl = document.querySelector('.rooms-list');
const roomsListView = new mdc.list.MDCList(roomsListEl);
const noRoomsViewEl = document.querySelector('.no-rooms-added');
const mainRoomsListViewEl = document.querySelector('.main-rooms-list-view');
const mainRoomViewEl = document.querySelector('.main-room-view');
const noDevicesViewEl = document.querySelector('.no-devices-added');
const topAppBarTitleEl = document.querySelector('#top-app-bar-title');
const addDeviceFabEl = document.querySelector('.add-device-fab');
const addDeviceDialogEl = document.querySelector('#mdc-dialog-device');
const addDeviceDialog = new mdc.dialog.MDCDialog(addDeviceDialogEl);
const addDeviceDialogTextFieldEl = document.querySelector('.add-device-text-field');
const addDeviceDialogTextField = new mdc.textField.MDCTextField(addDeviceDialogTextFieldEl);
let rooms = [];
let devicesForRoom = [];
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
    for(let room of rooms) {
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
        spanTextPri.textContent = room.name;
        let spanTextSec = document.createElement('span');
        spanTextSec.classList.add('mdc-list-item__secondary-text');
        spanTextSec.setAttribute('id', 'room-id');
        spanTextSec.textContent = room.id;
        li.appendChild(iconSpan);
        iconSpan.appendChild(icon);
        spanText.appendChild(spanTextPri);
        spanText.appendChild(spanTextSec);
        li.appendChild(spanText);
        roomsListEl.appendChild(li);
    }
    roomsListViewEl.style.display = 'block';
    attachClickListenerToRoomsList();
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
    topAppBarTitleEl.textContent = roomObj.name;
    getDevicesForRoomFromDb(roomObj.id).then(data => {
      devicesForRoom = data; // reassign to local var
      if(devicesForRoom > 0) {
        constructDevicesList();
      }
      else {
        noDevicesViewEl.style.display = 'block';
      }
    });
}
addDeviceFabEl.addEventListener('click', () => addDeviceDialog.open());

