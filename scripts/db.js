const db = new Dexie('appDb');
db.version(1).stores({
    rooms: '++id,name',
    devices: '++id, name, powerConsumption, image, avgHours, roomId'
});
const addNewRoomToDb = (roomName) => {
    console.log("Adding a new room to db...");
    return new Promise((resolve, reject) => {
        db.rooms.add({"name": roomName}).then((data) => resolve(data));
    });
}
const getAllRoomsFromDb = () => {
    console.log("Grabbing rooms from db...");
    return new Promise((resolve, reject) => {
        db.rooms.toArray().then((data) => resolve(data));
   });
}
const addNewDeviceForRoomToDb = (name, powerConsumption, avgHours, image, roomId) => {
    console.log("Adding a new device to db...")
    const deviceObj = {
        "name": name,
        "powerConsumption": powerConsumption,
        "avgHours": avgHours,
        "image": image,
        "roomId": roomId
    }
    return new Promise((resolve, reject) => {
        db.devices.add(deviceObj).then((data) => resolve(data));
    });
}
const getDevicesForRoomFromDb = (roomId) => {
    console.log(`Grabbing devices for room # ${roomId}`);
    return new Promise((resolve, reject) => {
       db.devices.where('roomId').equals(roomId).toArray().then((data) => resolve(data)) ;
    });
}