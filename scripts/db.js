const db = new Dexie('appDb');
db.version(1).stores({
    rooms: '++id,name',
    devices: '++id, name, powerConsumption, image'
});
const addNewRoomToDb = (roomName) => {
    console.log("Adding a new room to db...");
    db.open().then(() => {
        return db.rooms.add({
            name: roomName
        });
    });
}
const getAllRoomsFromDb = () => {
    console.log("Grabbing rooms from db...");
    return new Promise((resolve, reject) => {
        db.table('rooms').toArray().then((data) => resolve(data));
   });
}