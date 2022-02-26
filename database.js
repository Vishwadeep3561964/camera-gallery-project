let db ;


// 1. opened a database
// 2. create objectstore

let openRequest = indexedDB.open("myDataBase");

openRequest.addEventListener("success", (e) => {
    console.log("db sucess");
    db = openRequest.result;
})

openRequest.addEventListener("error", (e) => {
    console.log("db error");
})

openRequest.addEventListener("upgradeneeded", (e) => {
    console.log("db upgraded & for initial creation also");
    db = openRequest.result;

    //creating object store
    db.createObjectStore("video" , {keyPath : "id"});
    db.createObjectStore("image" , {keyPath :  "id"}); 

})