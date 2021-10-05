async function init(devToken){
    console.log(devToken);

    //const setupMusicKit = new Promise((resolve) => {
    return new Promise(function(resolve){

        console.log("initing");

        const musicKitInstance = window.MusicKit.configure({
        developerToken: devToken,
        app: {
            name: "Judge My Apple Music",
            build: "2.0.0"
        }
        });

        console.log(musicKitInstance);

        delete window.MusicKit; // clear global scope
        resolve(musicKitInstance);
		
    });
}

export default { init };