let video = document.querySelector("video");
let recordBtncont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtncont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;

let transparentcolor = "transparent";
let recorder;
let chunks = []; //media data in the form of chunks

let constraints = {
    video: true,
    audio: true
}

navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {

        video.srcObject = stream;

        recorder = new MediaRecorder(stream);

        recorder.addEventListener("start", (e) => {
            chunks = [];
        })

        recorder.addEventListener("dataavailable", (e) => {
            chunks.push(e.data);
        })

        recorder.addEventListener("stop", (e) => {
            //converting chunks in video form
            let blob = new Blob(chunks, { type: "video/mp4" });
            // let videourl = URL.createObjectURL(blob);
            if (db) {
                let videoID = shortid();
                let dbTransaction = db.transaction("video", "readwrite");
                let videoStore = dbTransaction.objectStore("video");
                let videoeEntry = {
                    id: `vid-${videoID}`,
                    blobData: blob
                }
                videoStore.add(videoeEntry);
            }
            // let a = document.createElement("a");
            // a.href = videourl;
            // a.download = "video.mp4";
            // a.click();

        })

        // })

        recordBtncont.addEventListener("click", (e) => {
            if (!recorder) return;

            recordFlag = !recordFlag;
            if (recordFlag) {
                //to start recording
                recorder.start();
                recordBtn.classList.add("scale-record");
                startTimer();
            }
            else {
                //to stop recording
                recorder.stop();
                recordBtn.classList.remove("scale-record");
                stopTimer();
            }
        })

        captureBtncont.addEventListener("click", (e) => {

            captureBtn.classList.add("scale-capture");

            let canvas = document.createElement("canvas");

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            let tool = canvas.getContext('2d');
            tool.drawImage(video, 0, 0, canvas.width, canvas.height);

            //adding filters now
            tool.fillStyle = transparentcolor;
            tool.fillRect(0, 0, canvas.width, canvas.height);

            //here we will merge this image
            let imageurl = canvas.toDataURL();

            if (db) {
                let imageID = shortid();
                let dbTransaction = db.transaction("image", "readwrite");
                let imageStore = dbTransaction.objectStore("image");
                let imageEntry = {
                    id: `img-${imageID}`,
                    url: imageurl,
                }
                imageStore.add(imageEntry);

                // let a = document.createElement("a");
                // a.href = imageurl;
                // a.download = "image.jpg";
                // a.click();

            }

            setTimeout(() => {
                captureBtn.classList.remove("scale-capture");
            }, 500)

        })

        let timerID;
        let counter = 0; //counter refers to the number of seconds
        let timer = document.querySelector(".timer");
        function startTimer() {
            timer.style.display = "block";
            function displayTimer() {

                let totalsec = counter;

                let hours = Number.parseInt(totalsec / 3600);
                totalsec = totalsec % 3600;

                let minutes = Number.parseInt(totalsec / 60);
                totalsec = totalsec % 60;

                let seconds = totalsec;

                hours = (hours < 10) ? `0${hours}` : hours;
                minutes = (minutes < 10) ? `0${minutes}` : minutes;
                seconds = (seconds < 10) ? `0${seconds}` : seconds;

                timer.innerText = `${hours}:${minutes}:${seconds}`
                counter++;
            }

            timerID = setInterval(displayTimer, 1000);
        }

        function stopTimer() {
            clearInterval(timerID);
            timer.innerText = "00:00:00"
            timer.style.display = "none";
        }

        let filterlayer = document.querySelector(".filter-layer");
        let allFilters = document.querySelectorAll(".filter");
        allFilters.forEach((filterElem) => {
            filterElem.addEventListener("click", (e) => {
                //get style & then  set style
                transparentcolor = getComputedStyle(filterElem).getPropertyValue("background-color");
                filterlayer.style.backgroundColor = transparentcolor;
            })
        })
    })