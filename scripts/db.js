const db = new Dexie('appDb');
db.version(1).stores({
    rooms: '++id,name',
    devices: '++id, name, powerConsumption, image'
});
const addNewRoomToDb = (roomName) => {
    console.log("Adding a new room to db...");
    return new Promise((resolve, reject) => {
        db.rooms.add({"name": roomName}).then((data) => resolve(data));
    })
}
const getAllRoomsFromDb = () => {
    console.log("Grabbing rooms from db...");
    return new Promise((resolve, reject) => {
        db.rooms.toArray().then((data) => resolve(data));
   });
}