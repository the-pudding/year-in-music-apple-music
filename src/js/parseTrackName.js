

function parseTrack(trackObject){

    // if(Object.keys(trackObject).indexOf("attributes") > -1){
    //     trackObject.artists = [];
    //     trackObject.artists.push({name:trackObject.attributes.artistName});

    //     trackObject.name = trackObject.attributes.name;
    // }

    console.log(trackObject);

    let trackName = trackObject.name.split("(feat")[0]

    let artists = trackObject.artists;
    return trackName + " by " + artists[0].name//.map(d => {return d.name }).join(", ");
}

export default { parseTrack }
