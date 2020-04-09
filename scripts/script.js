const addRoomFabEl = document.querySelector('.add-room-fab');
mdc.ripple.MDCRipple.attachTo(addRoomFabEl);
const addRoomDialogEl = document.querySelector('#mdc-dialog-room');
const addRoomDialog = new mdc.dialog.MDCDialog(addRoomDialogEl);
const addRoomDialogTextFieldEl = document.querySelector('.add-room-text-field');
const addRoomDialogTextField = new mdc.textField.MDCTextField(addRoomDialogTextFieldEl);
const snackbarEl = document.querySelector('.mdc-snackbar');
const snackbar = new mdc.snackbar.MDCSnackbar(snackbarEl);
const roomsListView = document.querySelector('.rooms-list-view');
const roomsList = document.querySelector('.rooms-list');
const noRoomsView = document.querySelector('.no-rooms-added');
let rooms = [];
getAllRoomsFromDb().then(data => {
    rooms = data; // reassign to local var
    if (rooms.length > 0) {
        noRoomsView.style.display = 'none';
        constructRoomsList();
    }
    else {
        noRoomsView.style.display = 'block';
    }
});

const constructRoomsList = () => {
    // clear the rooms list first
    roomsList.textContent = '';
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
        spanTextSec.textContent = room.id;
        li.appendChild(iconSpan);
        iconSpan.appendChild(icon);
        spanText.appendChild(spanTextPri);
        spanText.appendChild(spanTextSec);
        li.appendChild(spanText);
        roomsList.appendChild(li);
    }
    roomsListView.style.display = 'block';
}
addRoomFabEl.addEventListener('click', () => addRoomDialog.open());

addRoomDialog.listen('MDCDialog:closing', (ev) => {
    // if the user filled in a name 
    if (ev.detail.action == 'yes' && addRoomDialogTextField.value.trim() != '') {
        snackbar.labelText = `New room "${addRoomDialogTextField.value}" added.`
        snackbar.open();
        addNewRoomToDb(addRoomDialogTextField.value.trim());
        rooms.push({"name": addRoomDialogTextField.value.trim(), id: 69});
        constructRoomsList();
    }
    // if the user left the room name empty
    else if (ev.detail.action == 'yes' && addRoomDialogTextField.value.trim() == '') {
        snackbar.labelText = "Room name can't be empty";
        snackbar.open();
    }
});

