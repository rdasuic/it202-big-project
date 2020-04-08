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
