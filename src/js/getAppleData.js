let genres = [];


async function init(setupMusicKit,token){


    function cleanGenres(data){
        return new Promise(function (resolve, reject) {
            let nested = d3.groups(genres.flat(1),function(d){return d;}).sort(function(a,b){
              return b[1].length - a[1].length;
            });

            nested = nested.filter(function(d){
                return d[0] != "Music"
            })
        
            resolve(nested);
        })
    }

    function apiHeaders() {
                
        return {
            Authorization: `Bearer ${setupMusicKit.developerToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Music-User-Token': setupMusicKit.musicUserToken,
        }
    };


    console.log(apiHeaders());


    console.log(token);
    console.log(setupMusicKit);

    let recentPlayed = await setupMusicKit.api.recentPlayed();

    let reco = await setupMusicKit.api.recommendations();

    let playlistForYou = null;

    for (let playlist in reco){
        let title = reco[playlist].attributes.title.stringForDisplay;
        if(title == "Made for You"){
            let items = reco[playlist].relationships.contents.data;
            for (let item in items){
                if(items[item].attributes.name == "Favorites Mix"){
                    playlistForYou = items[item].id;
                }
            }
        }
    }

    let recentAdded = await setupMusicKit.api.library.collection('recently-added', null, null);
    let recentTracks = await fetch(`https://api.music.apple.com/v1/me/recent/played/tracks`, { headers: apiHeaders() }).then(r => r.json());
    let forYouPlaylist = await fetch(`https://api.music.apple.com/v1/catalog/us/playlists?ids=${playlistForYou}`, { headers: apiHeaders() })
        .then(r => { 
            return r.json();
        })
        .then(data => {
            console.log(data);

            let trackList = [];

            data.data.forEach(tracks => {

                console.log(tracks);

                tracks.relationships.tracks.data.forEach(track => {
                    trackList.push(track);
                    genres.push(track.attributes.genreNames);
                })
            })

            return trackList;

        })

    genres = await cleanGenres();

    console.log(genres);

    return {
        recentPlayed: recentPlayed,
        recentAdded: recentAdded,
        recentTracks: recentTracks,
        forYouPlaylist: forYouPlaylist,
        genres: genres
    }



}

export default { init };