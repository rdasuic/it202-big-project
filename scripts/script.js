const addRoomFabEl = document.querySelector('.add-room-fab');
mdc.ripple.MDCRipple.attachTo(addRoomFabEl);
const addRoomDialogEl = document.querySelector('#mdc-dialog-room');
const addRoomDialog = new mdc.dialog.MDCDialog(addRoomDialogEl);
const addRoomDialogTextFieldEl = document.querySelector('.add-room-text-field');
const addRoomDialogTextField = new mdc.textField.MDCTextField(addRoomDialogTextFieldEl);
const snackbarEl = document.querySelector('.mdc-snackbar');
const snackbar = new mdc.snackbar.MDCSnackbar(snackbarEl);
addRoomFabEl.addEventListener('click', () => addRoomDialog.open());

addRoomDialog.listen('MDCDialog:closing', (ev) => {
    // if the user filled in a name 
    if (ev.detail.action == 'yes' && addRoomDialogTextField.value.trim() != '') {
        snackbar.labelText = `New room "${addRoomDialogTextField.value}" added.`
        snackbar.open();
        addNewRoomToDb(addRoomDialogTextField.value.trim());
    }
    // if the user left the room name empty
    else if (ev.detail.action == 'yes' && addRoomDialogTextField.value.trim() == '') {
        snackbar.labelText = "Room name can't be empty";
        snackbar.open();
    }
});