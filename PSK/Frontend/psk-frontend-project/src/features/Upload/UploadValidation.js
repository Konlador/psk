const fileUpload = document.getElementById("video-upload");

fileUpload.addEventListener("change", event => {
	const resultEl = document.getElementById("meta");
	const file = event.target.files[0];
	const videoEl = document.createElement("video");
	videoEl.src = window.URL.createObjectURL(file);
  
	videoEl.onloadedmetadata = event => {
		window.URL.revokeObjectURL(videoEl.src);
		const { name, type } = file;
		const { videoWidth, videoHeight } = videoEl;
    
  //check the video width/height
	if (videoWidth > 0 && videoHeight > 0) {//write uploaded video details
		resultEl.innerHTML = `
			Filename: ${name}<br/>
			Type: ${type}<br/>
			Size: ${videoWidth}px x ${videoHeight}px`;
	
	}
	else {
		resultEl.innerHTML = 'AUDIO UPLOADED, NOT VIDEO.  POPUP (galima cj same errora daryt, kaip ir apacioj)';
	 // var message = "please upload video, not audio";
	  //return message;
	}

  }
  
	// is not a video, display an error.
	videoEl.onerror = () => {
		resultEl.innerHTML = 'Please upload a video file.';
		// var message = "please upload video, not audio";
		//return message;
	}
})