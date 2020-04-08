const addRoomFabEl = document.querySelector('.add-room-fab');
mdc.ripple.MDCRipple.attachTo(addRoomFabEl);
const addRoomDialogEl = document.querySelector('#mdc-dialog-room');
const addRoomDialog = new mdc.dialog.MDCDialog(addRoomDialogEl);
const addRoomDialogTextFieldEl = document.querySelector('.add-room-text-field');
const addRoomDialogTextField = new mdc.textField.MDCTextField(addRoomDialogTextFieldEl);
const snackbarEl = document.querySelector('.mdc-snackbar');
const snackbar = new mdc.snackbar.MDCSnackbar(snackbarEl);
addRoomFabEl.addEventListener('click', () => addRoomAction());
const addRoomAction = () => {
    addRoomDialog.open();
}
addRoomDialog.listen('MDCDialog:closing', (ev) => {
    console.log(ev);
    //if the user cancelled the dialog
    if(ev.detail.action == 'no' || ev.detail.action == 'close') {
        console.log("close");
    }
    // if the user didn't fill in a name 
    else if (ev.detail.action == 'yes' && addRoomDialogTextField.value.trim() != '') {
        console.log(`New room with name ${addRoomDialogTextField.value}`);
        snackbar.labelText = `New room with name "${addRoomDialogTextField.value}" added.`
        snackbar.open();
    }
});