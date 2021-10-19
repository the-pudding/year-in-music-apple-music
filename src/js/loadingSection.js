import { selectAll } from "./utils/dom";
import howler from 'howler';
import parseTrackName from "./parseTrackName";
import getData from "./getData";
import typeOutText from './typeOutText'
import coverFlow from './coverFlow'
import urlParameter from './utils/url-parameter'
import musicKitSetup from './musicKitSetup'
import getAppleData from "./getAppleData";

let deauthValue = null;
let client = null;
let imageWidth = 120;
let albumsShifted = 0;
let coverFlowImages = [];
let setupMusicKit = null;
let scoreNumContainer = d3.select(".score-num");
let tracks = null;
let tokenExists = false;
let finalScore = null;
let artists = null;
let playlists = null;
let artistRecentUrl = null;
let workoutPlaylists = [];
let partyPlaylists = [];
let genres = null;
let recentPlaylists = [];
let allPlaylists = null;
let songPreviewChat = null;
let songPreviewLoop = null;
let previewPlayPauseButton = null;
let playSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play-circle"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>'
let pauseSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pause-circle"><circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line></svg>'
let responses = null;
let input = null;
let artistsRecent = null;
let artistsLong = null;

let loginResponse = null;



function sleeper(ms) {
      return new Promise(function(resolve){
          setTimeout(function(){
            resolve();
          },ms);
      })
}



function appendText(weight,text,container){
        return new Promise(function(resolve){

            console.log("promise",text);

            d3.select(container)
                .append("p")
                .attr("class",function(d){
                    if(weight == "bold" && container == ".data-output"){
                        return "data-label"
                    }
                    return null;
                })
                .append("span")
                .html(text.replace(" (Deluxe)",""));
            resolve();

        });
    // };
}

function appendImage(image,container){
    return new Promise(function(resolve){

        d3.select(container).append("p").attr("class","row-image").append("span")
            .each(function(d,i){
                let art = d3.select(this).node().appendChild(image[i]);
                d3.select(art).attr("class","art")
            });

        resolve();
    });
}

function incrementScore(end){

    let num = null;

    if (d3.select(".score-text").html() == '<span>Awaiting Data</span>'){
        num = 70;
        d3.select(".score-text").html("/100<span></span>");

    }
    else {
        console.log("there");
        num = +scoreNumContainer.text();
    }

    console.log(num);

    let scale = d3.scaleQuantize()
        .domain([0,100])
        .range(["Pretty good", "Good", "Decent", "Respectable", "All right", "Solid", "Okay", "Fair", "Fine", "Mediocre", "Hit-or-miss", "Some bold choices...", "Unique...", "Could be worse", "Kinda rough", "Weak", "Expected", "Okay if ironic", "Cliche", "Embarrassing", "Gross", "Bad", "Bleak", "Distressing", "Discouraging", "Nauseating", "Exhausting", "Sad", "Horrific" ].reverse());

    function updateText(){
        d3.select(".score-text").html("/100")//, <span>"+scale(num))+"</span>";
    }

    function increment(){
        setTimeout(function(d){
            if(num != end){
                if(num < end){
                    num = num + 1;
                }
                else {
                    num = num - 1;
                }
                scoreNumContainer.text(num);
                increment();
            }
            else {
                updateText()
                return num;
                //resolve();
            }
        },50)
    }
    increment();
}

function appendLogin(choices,container){
    return new Promise(function(resolve){

        let optionWrapper = d3.select(container).append("div")

        let options = optionWrapper
            .attr("class","options align-right")
            .selectAll("p")
            .data(choices)
            .enter()
            .append("p")
            // .append("p")

          console.log("apple stuff");

        options
            .each(function(d,i){
                if(i==0){
                    let aTag = d3.select(this)
                        .append("a")
                        //  .attr("href","https://stark-ocean-68179.herokuapp.com/login")
                         .attr("href","https://dreadful-spider-05298.herokuapp.com/login")

                    aTag.on("click",function(d){
                      d3.select(this).select("span").style("background-color","#000000").style("color","white").html("Connecting...")
                    })

                    aTag.append("span")
                        //.attr("href","https://accounts.spotify.com/en/login?continue=https:%2F%2Faccounts.spotify.com%2Fauthorize%3Fscope%3Duser-read-private%2Buser-top-read%2Buser-follow-read%2Buser-library-read%2Bplaylist-read-private%2Bplaylist-read-collaborative%26response_type%3Dcode%26redirect_uri%3Dhttp%253A%252F%252Fdreadful-spider-05298.herokuapp.com%252Fcallback%26state%3Dabc%26client_id%3D233e9b508503421e9441079954508772")
                        .html('<svg class="spotify-logo" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"> <path d="M8.97285 0C13.9281 0 17.9453 4.01711 17.9453 8.97236C17.9453 13.9278 13.9281 17.9446 8.97285 17.9446C4.01706 17.9446 0.000276566 13.9278 0.000276566 8.97236C0.000276566 4.01743 4.01706 0.000428569 8.97295 0.000428569L8.97285 0ZM4.85813 12.9407C5.01885 13.2043 5.36385 13.2879 5.62742 13.1261C7.73406 11.8393 10.3861 11.5479 13.5093 12.2614C13.8102 12.33 14.1102 12.1414 14.1788 11.8404C14.2477 11.5393 14.0599 11.2393 13.7582 11.1707C10.3403 10.3895 7.40856 10.7261 5.04349 12.1714C4.77992 12.3332 4.69635 12.6771 4.85813 12.9407ZM3.75992 10.4973C3.96242 10.8268 4.39313 10.9307 4.72206 10.7282C7.13385 9.24546 10.8102 8.81614 13.6629 9.68207C14.0329 9.79382 14.4236 9.58532 14.5359 9.216C14.6473 8.84604 14.4387 8.45604 14.0694 8.34354C10.8109 7.35482 6.75992 7.83375 3.99028 9.53572C3.66135 9.73822 3.55742 10.1689 3.75992 10.4974V10.4973ZM3.66563 7.95332C6.55742 6.23571 11.3285 6.07779 14.0895 6.91575C14.5328 7.05021 15.0017 6.79993 15.136 6.35657C15.2704 5.913 15.0203 5.44446 14.5766 5.30968C11.4072 4.34754 6.13849 4.53343 2.80913 6.50989C2.40949 6.74657 2.27878 7.26161 2.51556 7.65986C2.75128 8.05864 3.26771 8.19011 3.66521 7.95332H3.66563Z" fill="black"/> </svg> Log in with Spotify')
                        ;
                }
                else if(i==1){
                    let aTag = d3.select(this)
                        .append("a")
                        .attr("href","https://safe-ocean-35530.herokuapp.com/applemusic")
                        //   .attr("href","https://mysterious-harbor-74984.herokuapp.com/applemusic")

                    aTag.on("click",function(d){
                      d3.select(this).select("span").style("background-color","#000000").style("color","white").html("Connecting...")
                    })

                    aTag.append("span")
                        //.attr("href","https://accounts.spotify.com/en/login?continue=https:%2F%2Faccounts.spotify.com%2Fauthorize%3Fscope%3Duser-read-private%2Buser-top-read%2Buser-follow-read%2Buser-library-read%2Bplaylist-read-private%2Bplaylist-read-collaborative%26response_type%3Dcode%26redirect_uri%3Dhttp%253A%252F%252Fdreadful-spider-05298.herokuapp.com%252Fcallback%26state%3Dabc%26client_id%3D233e9b508503421e9441079954508772")
                        .html('<svg class="apple-logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 84.3 20.7" style="enable-background:new 0 0 84.3 20.7;" xml:space="preserve"> <path d="M35.4,20.1V6.6h-0.1l-5.4,13.5h-2.1L22.4,6.6h-0.1v13.5h-2.5V1.8H23l5.8,14.6h0.1l5.8-14.6H38v18.3L35.4,20.1L35.4,20.1z   M52.1,20.1h-2.6v-2.3h-0.1c-0.7,1.6-2.1,2.5-4.1,2.5c-2.9,0-4.6-1.9-4.6-5V6.7h2.7v8.1c0,2,1,3.1,2.8,3.1c2,0,3.1-1.4,3.1-3.5V6.7  h2.7L52.1,20.1L52.1,20.1z M59.5,6.5c3.1,0,5,1.7,5.1,4.2h-2.5c-0.2-1.3-1.1-2.1-2.6-2.1C58,8.6,57,9.3,57,10.4c0,0.8,0.6,1.4,2,1.7  l2.1,0.5c2.7,0.6,3.7,1.7,3.7,3.6c0,2.4-2.2,4.1-5.3,4.1c-3.3,0-5.3-1.6-5.5-4.2h2.7c0.2,1.4,1.2,2.1,2.8,2.1c1.6,0,2.6-0.7,2.6-1.8  c0-0.9-0.5-1.4-1.9-1.7l-2.1-0.5c-2.5-0.6-3.7-1.8-3.7-3.8C54.4,8.1,56.4,6.5,59.5,6.5z M66.8,3.2c0-0.9,0.7-1.6,1.6-1.6  c0.9,0,1.6,0.7,1.6,1.6c0,0.9-0.7,1.6-1.6,1.6C67.5,4.8,66.8,4.1,66.8,3.2L66.8,3.2z M67,6.7h2.7v13.4H67V6.7z M81.1,11.3  c-0.3-1.4-1.3-2.6-3.1-2.6c-2.1,0-3.5,1.8-3.5,4.6c0,2.9,1.4,4.6,3.5,4.6c1.7,0,2.7-0.9,3.1-2.5h2.6c-0.3,2.8-2.5,4.8-5.7,4.8  c-3.8,0-6.2-2.6-6.2-6.9c0-4.2,2.4-6.9,6.2-6.9c3.4,0,5.4,2.2,5.7,4.8L81.1,11.3L81.1,11.3z M11.5,3.6C10.8,4.4,9.7,5.1,8.6,5  C8.4,3.8,9,2.6,9.6,1.9c0.7-0.9,1.9-1.5,2.9-1.5C12.6,1.5,12.2,2.7,11.5,3.6L11.5,3.6z M12.5,5.2c0.6,0,2.4,0.2,3.6,2  c-0.1,0.1-2.1,1.3-2.1,3.8c0,3,2.6,4,2.6,4c0,0.1-0.4,1.4-1.3,2.8c-0.8,1.2-1.7,2.4-3,2.4c-1.3,0-1.7-0.8-3.2-0.8  c-1.5,0-2,0.8-3.2,0.8c-1.3,0-2.3-1.3-3.1-2.5c-1.7-2.5-3-7-1.2-10c0.8-1.5,2.4-2.5,4-2.5c1.3,0,2.5,0.9,3.2,0.9  C9.5,6.1,10.9,5.1,12.5,5.2L12.5,5.2z"/> </svg> Log in with Apple Music')
                        ;
                }
                else {
                    d3.select(this)
                        .append("span")
                        .text(d => d)
                        .on("click",function(d,i){
                            let selected = d3.select(this).text();

                            options
                                .style("display",function(d,i){
                                    if(d3.select(this).select("span").text() != selected){
                                        return "none";
                                    }
                                    return null;
                                })
                                .each(function(d,i){
                                    if(d3.select(this).select("span").text() == selected){
                                      d3.select(this).select("span").classed("selected-option",true);
                                    }
                                })

                            resolve([selected,null]);

                        })
                        ;

                }
            })


        options
            .on("click",function(d,i){

                // let selected = d3.select(this).text();

                // options.style("display",function(d,i){
                //     if(d3.select(this).text() != selected){
                //         return "none";
                //     }
                //     return null;
                // })

                // console.log(selected);

                // resolve(selected);

                //return resolve(selected);
            })
            ;

        scrollBottom();
    })
}

async function appendAppleAuthorizationLogOut(choices,container,setupMusicKit){

    return new Promise(async function(resolve){

        let optionWrapper = d3.select(container).append("div")

        let options = optionWrapper
            .attr("class","options align-right")
            .selectAll("p")
            .data(choices)
            .enter()
            .append("p")
            .append("span")
            .text(d => d);

        options
            .on("click", async function(d,i){

                console.log("click");

  
                

                // let selected = d3.select(this).text();

                // options
                //     .style("display",function(d,i){
                //         if(d3.select(this).text() != selected){
                //             return "none";
                //         }
                //         return null;
                //     })
                //     .classed("selected-option",function(d,i){
                //         if(d3.select(this).text() == selected){
                //             return true;
                //         }
                //         return false;
                //     })
                // resolve([selected,optionWrapper.node(),appleData]);
            })
            ;

        scrollBottom();
    })
}

async function appendAppleAuthorization(choices,container,setupMusicKit){

    return new Promise(async function(resolve){

        let optionWrapper = d3.select(container).append("div")

        let options = optionWrapper
            .attr("class","options align-right")
            .selectAll("p")
            .data(choices)
            .enter()
            .append("p")
            .append("span")
            .text(d => d);

        options
            .on("click", async function(d,i){

                console.log("click",i);

                let selected = d3.select(this).text();
                options
                    .style("display",function(d,i){
                        if(d3.select(this).text() != selected){
                            return "none";
                        }
                        return null;
                    })
                    .classed("selected-option",function(d,i){
                        if(d3.select(this).text() == selected){
                            return true;
                        }
                        return false;
                    })


                if(i=="Sounds good!"){
                    let appleData = await setupMusicKit.authorize().then(async (token) => {
                        return await getAppleData.init(setupMusicKit,token);
                    })
    
    
 
                    resolve([selected,optionWrapper.node(),appleData]);
                }
                else {
                    resolve([selected,optionWrapper.node(),null]);
                }
                
            })
            ;

        scrollBottom();
    })
}

function appendOptions(choices,container){
        return new Promise(function(resolve){

            let optionWrapper = d3.select(container).append("div")

            let options = optionWrapper
                .attr("class","options align-right")
                .selectAll("p")
                .data(choices)
                .enter()
                .append("p")
                .append("span")
                .text(d => d);

            options
                .on("click",function(d,i){

                    let selected = d3.select(this).text();

                    options
                        .style("display",function(d,i){
                            if(d3.select(this).text() != selected){
                                return "none";
                            }
                            return null;
                        })
                        .classed("selected-option",function(d,i){
                            if(d3.select(this).text() == selected){
                                return true;
                            }
                            return false;
                        })

                    //only if logged in
                    // if(tokenExists){
                    //     incrementScore(+scoreNumContainer.text()-10+Math.floor(Math.random()*10));
                    // }



                    resolve([selected,optionWrapper.node()]);
                })
                ;


            // if(choices[0] == "Yeah, actually"){
            //     setTimeout(function(d,i){
            //         resolve([null,optionWrapper.node()]);
            //     },1000)
            // }
            scrollBottom();
        })
}

function pause(){
    return new Promise(function (resolve, reject) {
        })
}



function dataAppend(dataset){
    return new Promise(function(resolve){

        let maxLength = 30;

        d3.select('.data-output')
            .append("div")
            .selectAll("p")
            .data(dataset)
            .enter()
            .append("p")
            .style("display","none")
            .text(function(d){
                if(d.length > maxLength){
                    return d.slice(0,maxLength-3) + "..."
                }
                return d;
            })
            .transition()
            .duration(0)
            .delay(function(d,i){
                return i * 100;
            })
            .style("display","block")
            .end()
            .then(() => {
                console.log("ended");
                resolve();
            });


    })

}


function loadImage(url) {
    return new Promise(resolve => {
      const image = new Image();
      image.addEventListener('load', () => {
        resolve(image);
      })
      image.src = url;
    });
}

function fuckMarryKill(dataset,platform){
    console.log("fnk");

    let images = dataset[1];
    console.log(dataset);

    return new Promise(function(resolve){

        let fmkAnswers = {F:0,M:0,K:0}
        function checkIfDone(){
            if(fmkAnswers["F"] + fmkAnswers["M"] + fmkAnswers["K"] == 3){
                resolve();
            }
        }

        let cols = d3.select(".chat-wrapper")
            .append("div")
            .attr("class","fmk align-right options")
            .selectAll("div")
            .data(dataset[0])
            .enter()
            .append("div")
            .attr("class","col")
            ;

        cols.each(function(d,i){
            d3.select(this)
              .append("img")
              .attr("src",function(d,i){
                if(platform == "spotify"){
                    let imagesToScan = images[i].images
                    let imageUrl = null;
                    if(d.images.length > 0){
                      imageUrl = getClosestImage(d.images);
                    }
                    return imageUrl;
                }
                else {
                    console.log(d);
                    return d.image;
                }
              })
        })

        // .append("img")
        //     .attr("src",function(d){ return d.images[0].url})

        cols.append("p")
            .attr("class","artist-name")
            .text(d => d.name);

        cols.append("div")
            .attr("class","fmk-options fmk-options-wide")
            .selectAll("p")
            .data(["Fuck","Marry","Kill"])
            .enter()
            .append("p")
            .attr("class","fmk-option fmk-option-wide")
            .append("span")
            .text(d => d)
            .on("click",function(d,i){
                console.log("here");
                console.log(d3.select(this).node());

                let answer = d3.select(this).text().slice(0,1);
                console.log(answer);
                console.log(fmkAnswers[answer]);
                if(fmkAnswers[answer] == 0){
                    console.log("here");
                    d3.select(this).classed("selected-option",true);
                    fmkAnswers[answer] = 1;
                }
                checkIfDone()
            })
            ;

        scrollBottom();


    })
}

function makeOutChoose(dataset){

    let images = dataset[1];
    console.log(dataset);

    return new Promise(function(resolve){

        let fmkAnswers = {f:0,m:0,k:0}
        function checkIfDone(){
            if(fmkAnswers["f"] + fmkAnswers["m"] + fmkAnswers["k"] == 3){
                resolve();
            }
        }

        let cols = d3.select(".chat-wrapper")
            .append("div")
            .attr("class","fmk align-right options")
            .selectAll("div")
            .data(dataset[0])
            .enter()
            .append("div")
            .attr("class","col")
            ;

        cols.each(function(d,i){
            d3.select(this).node().appendChild(images[i]);
        })
        // .append("img")
        //     .attr("src",function(d){ return d.images[0].url})

        cols.append("p")
            .attr("class","artist-name")
            .text(d => d.name);

        cols.append("div")
            .attr("class","fmk-options")
            .selectAll("p")
            .data(function(d){
                console.log(d);
                let name = d[0] + ", " + d[1][0].artists[0].name;
                return [name];
            })
            .enter()
            .append("p")
            .attr("class","fmk-option")
            .append("span")
            .text(function(d){
                console.log(d);
                return d;
            })
            .on("click",function(d,i){
                d3.select(this).classed("selected-option",true)
                resolve()
            })
            ;

        scrollBottom();


    })
}

function preloadImagesHighRes(imageArray){
    return Promise.all(imageArray.map(function(d){
      let imageUrl = null;
      if(d.images.length > 0){
        imageUrl = getClosestImage(d.images);
        console.log(imageUrl);
        return loadImage(imageUrl)
      }
      return null;
    }))
}

function preloadImages(imageArray){

  return Promise.all(imageArray.map(function(d){
    let imageUrl = null;
    if(d.images[d.images.length-1].url === undefined){
        console.log("missing image",d);
        return null;
    }
    if(d.images.length > 0){
      imageUrl = getClosestImage(d.images);
      console.log(imageUrl);
      return loadImage(imageUrl)
    }
    return null;
  }))


    return Promise.all(imageArray.map(function(d){
        return loadImage(d.images[d.images.length-1].url)
    }))
}

function scrollBottom(){
    return new Promise(function(resolve){
        let el = d3.select(".chat-section").node();
        el.scrollTo(0,el.scrollHeight);
        // let element = d3.select(".chat-wrapper").node();
        // console.log(element.scrollTop,element.scrollHeight, element.clientHeight);
        // element.scrollTop = element.scrollHeight;
        resolve();
    });
}


function appendThinking(container){
    return new Promise(function(resolve){
        d3.select(container)
            .append("div")
            .attr("class","thinking-container")
            .html('<svg version="1.1" id="loader" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-49.5 -1.8 129 84.5" style="enable-background:new -49.5 -1.8 129 84.5;" xml:space="preserve"> <path style="fill:#E9E9E9;" d="M42.4,73.3H-0.4c-18.1,0-33-14.8-33-33v-4.7c0-18.1,14.9-33,33-33h42.8c18.2,0,33,14.9,33,33v4.7 C75.4,58.5,60.5,73.3,42.4,73.3z"/> <circle style="fill:#C8C8C8;" cx="1" cy="38" r="9"/> <circle style="fill:#C8C8C8;" cx="21" cy="38" r="9"/> <circle style="fill:#aaa;" cx="41" cy="38" r="9"/> <circle style="fill:#E9E9E9;" cx="-25.2" cy="62.6" r="10.8"/> <circle style="fill:#E9E9E9;" cx="-41" cy="74.8" r="5"/> </svg>')

        resolve();
    })
}

function removeThinking(container){
    return new Promise(function(resolve){
        d3.select(container)
            .select(".thinking-container")
            .remove();

        resolve();
    })
}

function appendAudio(songId,container){

    let timestamp = null;

    function playSong(){

        if(!songPreviewChat){

            songPreviewChat = new Howl({
                src: songId,
                format: ['mpeg'],
                preload: false,
                autoUnlock: true,
                volume: 0
            });

            songPreviewChat.on('end', function() {
                stopPreview();
            })

            // songPreviewChat.on('update_progress', function() {

            // })

            songPreviewChat.once('load', function () {
                songPreviewChat.fade(0, .3, 2000);
                songPreviewChat.play();
                previewPlayPauseButton.html(pauseSvg)

                songPreviewLoop = setInterval(function(){
                    if(songPreviewChat.seek() > 1){
                        let numValue = 30 - Math.round(songPreviewChat.seek());
                        if(numValue < 10){

                            numValue = "0"+Math.min(0,numValue);
                        }
                        timestamp.text("00:"+numValue)
                    }

                },500)



            });



            songPreviewChat.load()

        }

        else {
            stopPreview();
        }


    }





    return new Promise(function(resolve){
        let wrapper = d3.select(container);

        let row = wrapper.append("div").attr("class","play-row")

        previewPlayPauseButton = row.append("div")
            .attr("class","play-button")
            .html(playSvg)
            .on("click", function(){
                playSong();
            })

        row.append("div")
            .attr("class","waveform")
            .html('<svg viewBox="0 0 83 30" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect y="10.5" width="2" height="9" fill="#007AFF"></rect> <rect x="3" y="8.1001" width="2" height="13.7" fill="#007AFF"></rect> <rect x="6" y="4.1001" width="2" height="21.7" fill="#007AFF"></rect> <rect x="9" y="5.3999" width="2" height="19.1" fill="#007AFF"></rect> <rect x="12" y="7.1001" width="2" height="15.7" fill="#007AFF"></rect> <rect x="15" y="5.1001" width="2" height="19.7" fill="#007AFF"></rect> <rect x="18" y="0.5" width="2" height="29" fill="#007AFF"></rect> <rect x="21" y="0.800049" width="2" height="28.3" fill="#007AFF"></rect> <rect x="24" y="7.1001" width="2" height="15.7" fill="#007AFF"></rect> <rect x="27" y="11.1001" width="2" height="7.7" fill="#007AFF"></rect> <rect x="30" y="13.7998" width="2" height="2.3" fill="#007AFF"></rect> <rect x="33" y="14.1001" width="2" height="1.7" fill="#007AFF"></rect> <rect x="36" y="13.7998" width="2" height="2.3" fill="#007AFF"></rect> <rect x="39" y="14.1001" width="2" height="1.7" fill="#007AFF"></rect> <rect x="42" y="14.1001" width="2" height="1.7" fill="#007AFF"></rect> <rect x="45" y="14.1001" width="2" height="1.7" fill="#007AFF"></rect> <rect x="48" y="14.1001" width="2" height="1.7" fill="#007AFF"></rect> <rect x="51" y="13.7998" width="2" height="2.3" fill="#007AFF"></rect> <rect x="54" y="8.1001" width="2" height="13.7" fill="#007AFF"></rect> <rect x="57" y="12.7998" width="2" height="4.3" fill="#007AFF"></rect> <rect x="60" y="12.7998" width="2" height="4.3" fill="#007AFF"></rect> <rect x="63" y="14.1001" width="2" height="1.7" fill="#007AFF"></rect> <rect x="66" y="14.1001" width="2" height="1.7" fill="#007AFF"></rect> <rect x="69" y="14.1001" width="2" height="1.7" fill="#007AFF"></rect> <rect x="72" y="14.1001" width="2" height="1.7" fill="#007AFF"></rect> <rect x="75" y="14.1001" width="2" height="1.7" fill="#007AFF"></rect> <rect x="78" y="14.1001" width="2" height="1.7" fill="#007AFF"></rect> <rect x="81" y="14.1001" width="2" height="1.7" fill="#007AFF"></rect> </svg>')

        timestamp = row.append("p")
            .attr("class","time-stamp")
            .text('00:28')

        resolve();



    })

}

function stopPreview(){
    if(songPreviewChat){
        songPreviewChat.stop();
        songPreviewChat = null;
        clearInterval(songPreviewLoop);
        previewPlayPauseButton.html(playSvg)
    }

}

function expandAscii(){
    return new Promise(function(resolve){
        let height = 0;
        let nodeHeight = d3.select(".ascii-art").select("pre").node().getBoundingClientRect().height;
        function expand(){

            if(height < nodeHeight){
                height = height + nodeHeight/4

                d3.select(".ascii-art").style("height",function(){
                    return height+"px";
                })

                setTimeout(function(){
                    expand()
                },750);
            }
            else {
                d3.select(".ascii-art").style("height","auto");
                resolve();
            }


        }

        expand();
    })
}

async function musicLoad(){

    return new Promise(function(resolve){
        document.addEventListener('musickitloaded', () => {
            resolve(true);
        });
    })
}


async function appleSequence(){

    console.log("money");

    console.log(deauthValue);

    let appleToken = urlParameter.get('dev_token');
    //await typeOutText.typeOut("Let's get you logged into Apple Music",".chat-wrapper",1000).then(scrollBottom)
    urlParameter.set('dev_token',null)

    if (MusicKit) {
        setupMusicKit = await musicKitSetup.init(appleToken);
    }
    else {
        let loaded = await musicLoad();
        setupMusicKit = await musicKitSetup.init(appleToken);
    }
    if(deauthValue){
        let appleData = await setupMusicKit.unauthorize().then(async (token) => {
            await typeOutText.typeOut("You've been logged out of Apple Music.",".chat-wrapper",0).then(scrollBottom)
            await typeOutText.typeOut("Reloading site...",".chat-wrapper",0).then(scrollBottom)

            location.href = "/"
        })
    }

    await typeOutText.typeOut("Alrighty. A new window will pop open asking for your Apple info.",".chat-wrapper",1000).then(scrollBottom)
    await typeOutText.typeOut("This allows for one-time access to your music history when you visit this site. We don't ever see your username/password and your music data is never saved.",".chat-wrapper",1000).then(scrollBottom)

    let response = await appendAppleAuthorization(["Sounds good!","Wait, I'm logging in with my Apple ID??"],".chat-wrapper",setupMusicKit)

    if(response[0] == "Wait, I'm logging in with my Apple ID??"){
        await typeOutText.typeOut("Yea so in order to get your Apple Music data, the app needs to make a secure request to Apple that will just include your latest music preferences. No information about your username or password is shared with us.",".chat-wrapper",0).then(scrollBottom)
        response = await appendOptions(["Ok I'm in.","Sorry this is sketchy."],".chat-wrapper")

        console.log(response[0]);

        if(response[0] == "Sorry this is sketchy."){
            await typeOutText.typeOut("Ok come back someother time if you'd like.",".chat-wrapper",0).then(scrollBottom)
        }
        else {
            await typeOutText.typeOut("Alrighty. A new window will pop open asking for your Apple info.",".chat-wrapper",1000).then(scrollBottom)

            let response = await appendAppleAuthorization(["Sounds good!","Wait, I'm logging in with my Apple ID??"],".chat-wrapper",setupMusicKit)
        
        }
    }


    // await appendAppleAuthorizationLogOut(["Yes","No"],".chat-wrapper",setupMusicKit)

    return response[2];
    // let appleData = await setupMusicKit.authorize().then(async (token) => {
    //     return await getAppleData.init(setupMusicKit,token);
    // })

    // return appleData;



}

async function loginSequence(){

        let textLegibleDelay = 250;

        //await expandAscii();

        await typeOutText.typeOut("Hi, I'm an A.I. trained to evaluate musical taste. To get started, I'll need to see  your Spotify or Apple Music.",".chat-wrapper",1000).then(scrollBottom)
        await typeOutText.typeOut("I'm just gonna look at what you listen to. I won't post or change anything.",".chat-wrapper",0).then(scrollBottom)

        loginResponse = await appendLogin(["login spotify","login apple","how do you know what's good?"],".chat-wrapper");
        if(loginResponse[0] == "how do you know what's good?"){
            await typeOutText.typeOut("I've been trained on a corpus of over two million indicators of objectively good music, including Pitchfork reviews, record store recommendations, and subreddits you've never heard of.",".chat-wrapper",0).then(scrollBottom)
            await typeOutText.typeOut("Can I look at your Spotify now?",".chat-wrapper",0).then(scrollBottom)
            loginResponse = await appendLogin(["login","No thanks"],".chat-wrapper");
            if(loginResponse[0] == "No thanks"){
                await typeOutText.typeOut("I can't judge your music without seeing your Spotify. I mean, I can guess from your browsing history and cookies that your taste is rough, but that's all I'll say for now.",".chat-wrapper",0).then(scrollBottom)
                loginResponse = await appendLogin(["login"],".chat-wrapper");
            }
        }
}

function getClosestImage(imageArray){
    let goal = 240;

    if(imageArray.length > 0){

      imageArray = imageArray.sort(function(a,b){
          return Math.abs(a.width - goal) - Math.abs(b.width - goal);
      });

      if(imageArray[0].hasOwnProperty("url")){
        return imageArray[0].url;
      }

    }
    return null;
}

async function init(data,token,clientParam,deauth){

    if(deauth) {
        deauthValue = deauth;
        urlParameter.set('deauth',null)

    }


    if (clientParam){
        client = clientParam;
        urlParameter.set('client',null)



        data = await appleSequence();

        console.log(data);
        //remove pagination
        data.recentTracks = data.recentTracks.data;


        if(data.forYouPlaylist.length  == 0){

            await typeOutText.typeOut("Missing data...",".chat-wrapper",500).then(scrollBottom)


            data.forYouPlaylist = data.recentTracks;
        }


        let coverFlowImagesUnfiltered = data.forYouPlaylist
            .map(function(d){
                return {item:d,image:d.attributes.artwork.url.replace("{w}x{h}bb.jpeg","240x240bb.jpeg").replace("{w}x{h}bb.jpg","240x240bb.jpg")}
            })

        artistsRecent = data.recentTracks
            .map(function(d){
                return {name:d.attributes.artistName,item:d,image:d.attributes.artwork.url.replace("{w}x{h}bb.jpeg","240x240bb.jpeg").replace("{w}x{h}bb.jpg","240x240bb.jpg")}
            })

        artistsRecent = d3.groups(artistsRecent,function(d){return d.item.attributes.artistName;}).sort(function(a,b){
            return b[1].length - a[1].length;
          }).map(function(d){
              return d[1][0];
        });

        coverFlowImagesUnfiltered = coverFlowImagesUnfiltered.filter(function (el) {
            return el.image != null;
        })
        .filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.image === thing.image
            ))
        )

        for (let cover in coverFlowImagesUnfiltered){
            coverFlowImagesUnfiltered[cover].item.artists = [];
            coverFlowImagesUnfiltered[cover].item.artists.push({name:coverFlowImagesUnfiltered[cover].item.attributes.artistName});
            coverFlowImagesUnfiltered[cover].item.name = coverFlowImagesUnfiltered[cover].item.attributes.name;
        }


        // for finding a lot of X...like a lot
        coverFlowImagesUnfiltered[7].item.name = coverFlowImagesUnfiltered[7].item.artists[0].name;

        // for oh great anothe x artist stan
        coverFlowImagesUnfiltered[10].item.name = coverFlowImagesUnfiltered[10].item.artists[0].name;

        //for are you ok, listening to alot of x recently
        artistRecentUrl = artistsRecent[0];

        // for of course artist
        let artistObservationThreePos = 13;
        if(artistRecentUrl){
            artistObservationThreePos = 14;
        }

        let artistObservationThree = coverFlowImagesUnfiltered[artistObservationThreePos];


        coverFlowImages.splice(artistObservationThreePos,0,artistObservationThree)

        if(artistRecentUrl){
            coverFlowImages.splice(12,0,artistRecentUrl)
        }

        coverFlowImages = coverFlowImagesUnfiltered;
        console.log(data)

        genres = data.genres;

        console.log(data);
        console.log(coverFlowImages);

    }
    else if(token.length > 0){

        tokenExists = true;
        tracks = data.tracks;

        tracks = data.tracks.filter(function(d){
                return d.timeFrame == "long_term" || d.timeFrame == "medium_term"
            })
            .map(function(d){ return d.trackData})
            .flat(1)
            .filter(function(d){
                return d.album.images.length > 0;
            })

        tracks = d3.groups(tracks,function(d){ return d.album.name });

        tracks = tracks.map(function(d){
            return d[1][0];
        });

        playlists = data.playlists;

        artistsLong = data.artists.filter(function(d){
            return d.timeFrame == "long_term"
        })[0].artistData;

        artistsRecent = data.artists.filter(function(d){
            return d.timeFrame == "medium_term"
        })[0].artistData;

        recentPlaylists = playlists[0].filter(function(d){
            return d.owned == true && d.albumArray.length > 1;
        });

        genres = data.genres;

        allPlaylists = playlists[0];

        coverFlowImages = tracks
            .map(function(d){
                let albumImages = d.album.images;
                return {item:d,image:getClosestImage(albumImages)}
            })

        coverFlowImages = coverFlowImages.filter(function (el) {
            return el.image != null;
        })
        ;

        coverFlowImages = d3.groups(coverFlowImages,function(d){return d.image; })
          .map(function(d){
            return {item:d[1][0].item,image:d[0]};
          });

        // for finding a lot of X...like a lot
        let artistObservationOne = {item:artistsLong[0],image:getClosestImage(artistsLong[0].images)}
        coverFlowImages.splice(7,0,artistObservationOne)

        // for oh great another x artist stan
        let artistObservationTwo = {item:artistsLong[2],image:getClosestImage(artistsLong[2].images)}
        coverFlowImages.splice(10,0,artistObservationTwo)


        //for are you ok, listening to alot of x recently
        artistRecentUrl = {item:artistsRecent[0],image:getClosestImage(artistsRecent[0].images)};
        if(artistRecentUrl){
            coverFlowImages.splice(12,0,artistRecentUrl)
        }

        // for of course artist
        let artistObservationThree = {item:artistsLong[4],image:getClosestImage(artistsLong[4].images)}
        let artistObservationThreePos = 13;
        if(artistRecentUrl){
          artistObservationThreePos = 14;
        }
        coverFlowImages.splice(artistObservationThreePos,0,artistObservationThree)


        // for recent playlists
        let recentPlaylistPos = artistObservationThreePos + 1;
        if(recentPlaylists.length > 0){
          let recentPlaylistOne = {item:recentPlaylists[0].name,image:getClosestImage(recentPlaylists[0].images)};
          coverFlowImages.splice(recentPlaylistPos,0,recentPlaylistOne)
        }


        workoutPlaylists = allPlaylists.filter(function(d){
            return d.workout == 1 && d.albumArray.length > 1;
        })

        partyPlaylists = allPlaylists.filter(function(d){
            return d.party == 1 && d.owned == true && d.albumArray.length > 1;
        })

        console.log(playlists);
        console.log(allPlaylists);
        console.log(workoutPlaylists);
        console.log(partyPlaylists);

        // for so... answer
        [coverFlowImages[2], coverFlowImages[9]] = [coverFlowImages[9], coverFlowImages[2]]


    }

    else {
        await loginSequence();
    }

    /////// DELETE THIS
    // finalScore = incrementScore(1+Math.floor(Math.random()*10));
    // return [finalScore,coverFlowImages];
    ///



    let startingSleeperTime = 1000;
    let imagesPreloaded = null;
    let response = null;

    coverFlow.init(coverFlowImages.slice(0,20).map(d => d.image),".cover-wrapper");


    // **** 1

    await sleeper(2000);

    coverFlow.scrollTick(1);
    albumsShifted = albumsShifted + 1;

    await typeOutText.typeOut("Analyzing your listening history...",".chat-wrapper",500).then(scrollBottom)

    incrementScore(90+Math.floor(Math.random()*10));
    d3.select(".score-section").style("visibility","visible");

    coverFlow.scrollTick(1)
    albumsShifted = albumsShifted + 1;

    await typeOutText.typeOut("lol",".chat-wrapper",500).then(scrollBottom)
    coverFlow.scrollTick(1)
    albumsShifted = albumsShifted + 1;

    await typeOutText.typeOut("omg",".chat-wrapper",500).then(scrollBottom)
    coverFlow.scrollTick(1)
    albumsShifted = albumsShifted + 1;

    await typeOutText.typeOut("okay hold up",".chat-wrapper",0).then(scrollBottom)

    await appendThinking(".chat-wrapper").then(scrollBottom)
    await sleeper(2000);
    await removeThinking(".chat-wrapper").then(scrollBottom)

    coverFlow.scrollTick(1)
    albumsShifted = albumsShifted + 1;
    coverFlow.raiseCover(albumsShifted-1);

    await typeOutText.typeOut(`Do you really listen to ${parseTrackName.parseTrack(coverFlowImages[albumsShifted-1].item)}?`,".chat-wrapper",0).then(scrollBottom)

    response = await appendOptions(["Yes","No","I share this account with someone else"],".chat-wrapper")
    incrementScore(70+Math.floor(Math.random()*10));
    if(response[0] == "Yes"){
        await typeOutText.typeOut("Like ironically?",".chat-wrapper",0).then(scrollBottom)
        response = await appendOptions(["lol yea","no..."],".chat-wrapper")
        if(response == "lol yea"){
            await typeOutText.typeOut("Right...",".chat-wrapper",0).then(scrollBottom)
        }
        else {
            await typeOutText.typeOut("Cool...",".chat-wrapper",0).then(scrollBottom)
        }
    }
    else if(response[0] == "No") {
        let adjust = ""
        if(platform != "apple"){
          adjust = "top 10"
        }
        await typeOutText.typeOut(`Weird, cause it's definitely in your ${adjust} most-played.`,".chat-wrapper",0).then(scrollBottom)
    }
    else {
      await typeOutText.typeOut(`yeah totally...`,".chat-wrapper").then(scrollBottom)
    }

    coverFlow.raiseCover(99);
    await sleeper(1000);

    coverFlow.scrollTick(1)
    albumsShifted = albumsShifted + 1;

    await appendThinking(".chat-wrapper").then(scrollBottom)
    await sleeper(2000);
    await removeThinking(".chat-wrapper").then(scrollBottom)
    coverFlow.scrollTick(1)
    albumsShifted = albumsShifted + 1;

    console.log(genres);

    await typeOutText.typeOut(`Seeing plenty of ${genres[0][0]}.`,".chat-wrapper",1500).then(scrollBottom);
    coverFlow.scrollTick(1)
    albumsShifted = albumsShifted + 1;

    await typeOutText.typeOut(`Finding a lot of ${coverFlowImages[albumsShifted-1].item.name}.`,".chat-wrapper",0).then(scrollBottom)
    await typeOutText.typeOut("Like... a LOT.",".chat-wrapper",500).then(scrollBottom)

    coverFlow.scrollTick(1)
    albumsShifted = albumsShifted + 1;

    // **** 1



    // await appendThinking(".chat-wrapper").then(scrollBottom)
    // await sleeper(2000);
    // await removeThinking(".chat-wrapper").then(scrollBottom)

    // coverFlow.scrollTick(1)
    // albumsShifted = albumsShifted + 1;

    // await sleeper(500);
    // coverFlow.raiseCover(albumsShifted-1);
    //
    // await sleeper(1000);
    // await typeOutText.typeOut(`So... ${parseTrackName.parseTrack(coverFlowImages[albumsShifted-1].item)}?`,".chat-wrapper",0).then(scrollBottom)
    //
    // response = await appendOptions(["I love it","it's ok","I share this account with someone else"],".chat-wrapper")
    // incrementScore(60+Math.floor(Math.random()*10));
    //
    // if(response[0] == "I love it"){
    //     await typeOutText.typeOut(`lol`,".chat-wrapper").then(scrollBottom)
    //     await sleeper(startingSleeperTime);
    //     await typeOutText.typeOut(`wait`,".chat-wrapper").then(scrollBottom)
    //     await sleeper(startingSleeperTime);
    //     await typeOutText.typeOut(`seriously?`,".chat-wrapper").then(scrollBottom)
    //     response = await appendOptions(["yes","lol no"],".chat-wrapper")
    //     if(response[0] == "yes"){
    //         await typeOutText.typeOut(`oh`,".chat-wrapper").then(scrollBottom)
    //         await sleeper(startingSleeperTime);
    //         await typeOutText.typeOut(`um`,".chat-wrapper").then(scrollBottom)
    //         await sleeper(startingSleeperTime);
    //         await typeOutText.typeOut(`awesome`,".chat-wrapper").then(scrollBottom)
    //     }
    //     else {
    //         await typeOutText.typeOut(`yeah totally...`,".chat-wrapper").then(scrollBottom)
    //     }
    // }
    // else if (response[0] == "it's okay"){
    //     await typeOutText.typeOut(`you just listen to it all the time?`,".chat-wrapper").then(scrollBottom)
    //     response = await appendOptions(["Yes","Not really"],".chat-wrapper")
    //     if(response[0] == "YES"){
    //         await typeOutText.typeOut(`thought so`,".chat-wrapper").then(scrollBottom)
    //     }
    //     else {
    //         await typeOutText.typeOut(`right...makes total sense`,".chat-wrapper").then(scrollBottom)
    //     }
    // }
    // else {
    //     await typeOutText.typeOut(`oh thank god`,".chat-wrapper").then(scrollBottom)
    // }
    //
    // coverFlow.raiseCover(99);
    // await sleeper(1000);


    // coverFlow.scrollTick(1)
    // albumsShifted = albumsShifted + 1;



    //**********

    await appendThinking(".chat-wrapper").then(scrollBottom)
    await sleeper(1000);
    await removeThinking(".chat-wrapper").then(scrollBottom)
    await typeOutText.typeOut(`oh boy ${parseTrackName.parseTrack(coverFlowImages[albumsShifted -1].item)}.`,".chat-wrapper",500).then(scrollBottom);
    coverFlow.scrollTick(1)
    albumsShifted = albumsShifted + 1;

    await appendThinking(".chat-wrapper").then(scrollBottom)
    await sleeper(1000);
    await removeThinking(".chat-wrapper").then(scrollBottom)

    coverFlow.scrollTick(1)
    albumsShifted = albumsShifted + 1;
    // // if(artistsLong.slice(2,3)[0].images.length > 0){
    // //     imagesPreloaded = await preloadImages(artistsLong.slice(2,3));
    // //     await appendImage(imagesPreloaded,".chat-wrapper").then(scrollBottom);
    // // }

    await typeOutText.typeOut(`oh great another ${coverFlowImages[albumsShifted-1].item.name}  stan...`,".chat-wrapper",1000).then(scrollBottom);

    coverFlow.scrollTick(1)
    albumsShifted = albumsShifted + 1;
    await sleeper(1000);



    if(artistRecentUrl){
        coverFlow.scrollTick(1)
        albumsShifted = albumsShifted + 1;
        await sleeper(500);
        coverFlow.raiseCover(albumsShifted - 1);
        await sleeper(1000);

        await typeOutText.typeOut(`You've been listening to a lot of ${artistsRecent[0].name} lately.`,".chat-wrapper").then(scrollBottom)
        await typeOutText.typeOut("u okay?",".chat-wrapper").then(scrollBottom)
        response = await appendOptions(["Yeah why","Not really"],".chat-wrapper")
        incrementScore(50+Math.floor(Math.random()*10));
        if(response[0] == "Yeah why"){
            await typeOutText.typeOut("no reason...",".chat-wrapper").then(scrollBottom)
        }
        else {
            await typeOutText.typeOut("listen i'm just a neural net do what you gotta do",".chat-wrapper").then(scrollBottom)
        }
    }
    coverFlow.raiseCover(99);
    await sleeper(1000);

    coverFlow.scrollTick(1)
    albumsShifted = albumsShifted + 1;


    await appendThinking(".chat-wrapper").then(scrollBottom)
    await sleeper(1000);
    await removeThinking(".chat-wrapper").then(scrollBottom)
    coverFlow.scrollTick(1)
    albumsShifted = albumsShifted + 1;

    await typeOutText.typeOut(`Of course ${coverFlowImages[albumsShifted-1].item.name}.`,".chat-wrapper",1000).then(scrollBottom);

    // console.log(partyPlaylists,recentPlaylists,workoutPlaylists);

    // if(partyPlaylists.length > 0 || recentPlaylists.length > 0 || workoutPlaylists.length > 0){
    //   await typeOutText.typeOut(`Now let's check out your playlists..`,".chat-wrapper").then(scrollBottom)
    //   await appendThinking(".chat-wrapper").then(scrollBottom)
    //   await sleeper(1000);
    //   await removeThinking(".chat-wrapper").then(scrollBottom)
    // }

    // if(recentPlaylists.length > 0){

    //   coverFlow.scrollTick(1)
    //   albumsShifted = albumsShifted + 1;
    //   coverFlow.raiseCover(albumsShifted-1);

    //   await typeOutText.typeOut(`Okay so I found your ${recentPlaylists[0].name} playlist.`,".chat-wrapper",1000).then(scrollBottom)
    //   await typeOutText.typeOut(`Whole lotta ${recentPlaylists[0].topArtists[0][0]} in there.`,".chat-wrapper").then(scrollBottom)
    //   await typeOutText.typeOut("Was that on purpose?",".chat-wrapper").then(scrollBottom)

    //   response = await appendOptions(["Yes","No"],".chat-wrapper")
    //   incrementScore(40+Math.floor(Math.random()*10));
    //   if(response[0] == "Yes"){
    //       await typeOutText.typeOut("I guess I applaud your honesty...",".chat-wrapper").then(scrollBottom)
    //       let bestTrack = recentPlaylists[0].trackArray.filter(function(d){
    //           return d.track.artists.filter(function(d){ return d.name == recentPlaylists[0].topArtists[0][0] }).length > 0
    //       })[0]
    //       await typeOutText.typeOut(`"${bestTrack.track.name}" is a helluva opener...`,".chat-wrapper").then(scrollBottom)
    //   }
    //   else {
    //       await typeOutText.typeOut(`riiiiiiiiight`,".chat-wrapper").then(scrollBottom)
    //   }

    //   coverFlow.raiseCover(99);
    //   await sleeper(1000);

    // }


    // coverFlow.scrollTick(1)
    // albumsShifted = albumsShifted + 1;
    // await appendThinking(".chat-wrapper").then(scrollBottom)
    // await sleeper(2000);
    // await removeThinking(".chat-wrapper").then(scrollBottom)


    // if(workoutPlaylists.length > 0){
    //     await typeOutText.typeOut(`I gotta ask. Do you actually work out to your ${workoutPlaylists[0].name} playlist?`,".chat-wrapper").then(scrollBottom)
    //     response = await appendOptions(["Yes","No"],".chat-wrapper")
    //     if(response[0] == "Yes"){
    //         let artistString = null;
    //         if(workoutPlaylists[0].hasOwnProperty('topArtists')){
    //           artistString = workoutPlaylists[0].topArtists.slice(0,2);
    //           if(artistString.length == 1){
    //               artistString = artistString[0];
    //           }
    //           else {
    //               artistString = artistString[0][0]+" and "+artistString[1][0];
    //           }
    //         }
    //         await typeOutText.typeOut(`sweatin' to ${artistString}! yea get swole lol?`,".chat-wrapper").then(scrollBottom)
    //     }
    //     else {
    //         await typeOutText.typeOut("Weird name i guess lol...",".chat-wrapper").then(scrollBottom)
    //     }
    // }


    // if(partyPlaylists.length > 0){
    //     await typeOutText.typeOut(`I need to know about the party you made ${partyPlaylists[0].name} for...`,".chat-wrapper").then(scrollBottom)
    //     response = await appendOptions(["it was fun","it was a disaster","why"],".chat-wrapper")
    //     if(response[0] == "it was fun"){
    //         await typeOutText.typeOut(`Yeah I bet.`,".chat-wrapper").then(scrollBottom)
    //     }
    //     else if(response[0]=="it was a disaster"){
    //         await typeOutText.typeOut("yeah who could have expected it lol",".chat-wrapper").then(scrollBottom)
    //     }
    //     else {
    //         let artistString = null;
    //         if(partyPlaylists[0].hasOwnProperty('topArtists')){
    //           artistString = partyPlaylists[0].topArtists.slice(0,2);
    //           if(artistString.length == 1){
    //               artistString = artistString[0] + " is certainly, um, an interesting pick...";
    //           }
    //           else {
    //               artistString = artistString[0][0]+" and "+artistString[1][0] + " are certainly, um, interesting picks...";
    //           }
    //         }

    //         await typeOutText.typeOut(`i mean  ${artistString}`,".chat-wrapper").then(scrollBottom)
    //     }
    // }

    // coverFlow.scrollTick(1)
    // albumsShifted = albumsShifted + 1;

    // d3.select(".cover-wrapper").transition().duration(1000).style("bottom","-100%");
    // d3.select(".data-output").transition().duration(1000).style("height","0px");
    // d3.select(".chat-wrapper").transition().duration(1000).style("padding-bottom","120px");
    // d3.select(".score-section").transition().duration(1000).style("bottom","10px");
    // scrollBottom();
    // await typeOutText.typeOut("One last thing...",".chat-wrapper").then(scrollBottom)

    // scrollBottom();
    // await sleeper(1500);



    //**********


    // let randomSong = Math.random();
    // if(randomSong < .50){
    //   await typeOutText.typeOut("Do you know this song?",".chat-wrapper").then(scrollBottom)
    //   await appendAudio("https://p.scdn.co/mp3-preview/baf1953982893c37fb13b65c6b7de4a8e543c1a7?cid=774b29d4f13844c495f206cafdad9c86",".chat-wrapper").then(scrollBottom);
    //   response = await appendOptions(["Yes","No"],".chat-wrapper")
    //   stopPreview();
    //   incrementScore(30+Math.floor(Math.random()*10));
    //
    //   if(response[0] == "Yes"){
    //       await typeOutText.typeOut("Do you like it?",".chat-wrapper").then(scrollBottom)
    //       response = await appendOptions(["Yes","No","Kind of"],".chat-wrapper")
    //       await typeOutText.typeOut("Makes sense.",".chat-wrapper").then(scrollBottom)
    //   }
    //   else {
    //       await typeOutText.typeOut("Yeah I figured.",".chat-wrapper").then(scrollBottom)
    //   }
    // }
    // else {
    //   await typeOutText.typeOut("Do you like this song? ",".chat-wrapper").then(scrollBottom)
    //   await appendAudio("https://p.scdn.co/mp3-preview/21b9abd3cd2eea634e17a917196fdd5ba2e82670?cid=774b29d4f13844c495f206cafdad9c86",".chat-wrapper").then(scrollBottom);
    //   response = await appendOptions(["Yes","No","Hell no"],".chat-wrapper")
    //   stopPreview();
    //   incrementScore(20+Math.floor(Math.random()*10));
    //
    //   if(response[0] == "Yes"){
    //
    //       await appendThinking(".chat-wrapper").then(scrollBottom)
    //       await sleeper(2000);
    //       await removeThinking(".chat-wrapper").then(scrollBottom)
    //       await sleeper(1000);
    //       await appendThinking(".chat-wrapper").then(scrollBottom)
    //       await sleeper(1000);
    //       await removeThinking(".chat-wrapper").then(scrollBottom)
    //
    //       await typeOutText.typeOut("okay things are making more sense now...",".chat-wrapper").then(scrollBottom)
    //
    //   }
    //   else if(response[0] == "No") {
    //       await typeOutText.typeOut("Seriously? It's fine if you do.",".chat-wrapper").then(scrollBottom)
    //       response = await appendOptions(["okay I do","no way"],".chat-wrapper")
    //       if(response[0] == "okay I do"){
    //           await typeOutText.typeOut("lolololololololol",".chat-wrapper").then(scrollBottom)
    //           await typeOutText.typeOut("sorry i meant to send that to someone else",".chat-wrapper").then(scrollBottom)
    //       }
    //       else {
    //           await typeOutText.typeOut("Oh watch out everybody we got a cool person over here!",".chat-wrapper").then(scrollBottom)
    //       }
    //   }
    //   else {
    //       await typeOutText.typeOut("Who you trying to impress?",".chat-wrapper").then(scrollBottom)
    //       await typeOutText.typeOut("Let's keep going",".chat-wrapper").then(scrollBottom)
    //   }
    // }
    //
    // await typeOutText.typeOut("Which record have you made out to?",".chat-wrapper").then(scrollBottom)
    //
    // let makeoutTracks = d3.groups(tracks,( d => d.album.name ))//.sort(function(a,b){return b[1].length - a[1].length });
    //
    // makeoutTracks = makeoutTracks.slice(5,8);
    // let makeoutTrackArt = makeoutTracks.map(function(d){
    //     return d[1][0].album
    // });
    //
    // imagesPreloaded = await preloadImages(makeoutTrackArt);
    // await makeOutChoose([makeoutTracks,imagesPreloaded]).then(scrollBottom)
    // incrementScore(30+Math.floor(Math.random()*10));
    // response = ["omfg","yeah makes sense","nooooooooooooooo"];
    // await typeOutText.typeOut(response[Math.floor(Math.random() * response.length)],".chat-wrapper").then(scrollBottom)
    //

    //********** 3



    await typeOutText.typeOut("Fuck marry kill. Choose fast.",".chat-wrapper").then(scrollBottom)

    if(clientParam){
        await fuckMarryKill([coverFlowImages.slice(11,14).map(d => {
            return {name:d.item.attributes.artistName,image:d.image};
        }),coverFlowImages.slice(11,14)],"apple")
        .then(scrollBottom)
    }
    else {
        await fuckMarryKill([artistsLong.slice(1,4),artistsLong.slice(1,4)],"spotify").then(scrollBottom)
    }


    await sleeper(1000);
    await appendThinking(".chat-wrapper").then(scrollBottom)
    await sleeper(2000);
    await removeThinking(".chat-wrapper").then(scrollBottom)
    incrementScore(20+Math.floor(Math.random()*10));
    response = ["Gross.","Whoa.", "Uhhhhhhhhhhhhh... cool.","Oh you went there...","Let's just leave that there."];
    await typeOutText.typeOut(response[Math.floor(Math.random() * response.length)],".chat-wrapper").then(scrollBottom);

    await typeOutText.typeOut("Have you been to Coachella?",".chat-wrapper").then(scrollBottom)
    response = await appendOptions(["yes","no"],".chat-wrapper")
    incrementScore(18+Math.floor(Math.random()*10));
    await typeOutText.typeOut("Clearly.",".chat-wrapper").then(scrollBottom)


    // await typeOutText.typeOut("Do you get your coffee at Starbucks?",".chat-wrapper").then(scrollBottom)
    // response = await appendOptions(["yes","no"],".chat-wrapper")
    // // await typeOutText.typeOut("Yeah i thought so",".chat-wrapper").then(scrollBottom)

    incrementScore(16+Math.floor(Math.random()*10));

    response = ["Well this has been... interesting.","That was exhausting.","Well I'm lightly nauseated."];
    await typeOutText.typeOut(response[Math.floor(Math.random() * response.length)],".chat-wrapper").then(scrollBottom);

    await typeOutText.typeOut("Let's get your final score.",".chat-wrapper",2000).then(scrollBottom)

    //********** 3

    finalScore = incrementScore(1+Math.floor(Math.random()*10));

    console.log(data)

    return [finalScore,coverFlowImages,data,setupMusicKit];





    // if(artistsLong.slice(1,2)[0].images.length > 0){
    //     imagesPreloaded = await preloadImages(artistsLong.slice(1,2));
    //     await appendImage(imagesPreloaded,".chat-wrapper").then(scrollBottom);
    // }
    // await typeOutText.typeOut(`ooo we got a real ${artistsLong[1].name} fan on our hands...`,".chat-wrapper",1000).then(scrollBottom);

    // coverFlow.scrollTick(1)

    // if(artistsLong.slice(2,3)[0].images.length > 0){
    //     imagesPreloaded = await preloadImages(artistsLong.slice(2,3));
    //     await appendImage(imagesPreloaded,".chat-wrapper").then(scrollBottom);
    // }
    // await typeOutText.typeOut(`oh great another ${artistsLong[2].name}  stan...`,".chat-wrapper",1000).then(scrollBottom);


    // await typeOutText.typeOut(`${artistsLong[3].name}, ${artistsLong[4].name}, AND ${artistsLong[5].name}?`,".chat-wrapper",0).then(scrollBottom);
    // await typeOutText.typeOut(`I guess I should have expected it.`,".chat-wrapper",0).then(scrollBottom);

    // coverFlow.scrollTick(1)

    ///// Generic questions /////

    // if(tracks[0].album.images.length > 0){
    //     imagesPreloaded = await preloadImages([tracks[0].album]);
    //     await appendImage(imagesPreloaded,".chat-wrapper").then(scrollBottom);
    // }
    // await typeOutText.typeOut(`Do you really listen to ${parseTrackName.parseTrack(tracks[0])}?`,".chat-wrapper",0).then(scrollBottom)
    // response = await appendOptions(["Yes","No"],".chat-wrapper")

    // incrementScore(70+Math.floor(Math.random()*10));
    // coverFlow.scrollTick(1)

    // if(response[0] == "Yes"){
    //     await typeOutText.typeOut("Like ironically?",".chat-wrapper",0).then(scrollBottom)
    //     response = await appendOptions(["lol yea","no..."],".chat-wrapper")
    //     if(response == "lol yea"){
    //         await typeOutText.typeOut("Right...",".chat-wrapper",0).then(scrollBottom)
    //     }
    //     else {
    //         await typeOutText.typeOut("Cool...",".chat-wrapper",0).then(scrollBottom)
    //     }
    // }
    // else {
    //     await typeOutText.typeOut("Weird, cause it's definitely in your top 5 most-played.",".chat-wrapper",0).then(scrollBottom)
    // }


    // await appendThinking(".chat-wrapper").then(scrollBottom)
    // await sleeper(2000);
    // await removeThinking(".chat-wrapper").then(scrollBottom)
    // await typeOutText.typeOut(`Plenty of ${genres[0][0]}.`,".chat-wrapper",1500).then(scrollBottom);
    // incrementScore(65+Math.floor(Math.random()*10));
    // coverFlow.scrollTick(1)




    // if(tracks[1].album.images.length > 0){
    //     imagesPreloaded = await preloadImages([tracks[1].album]);
    //     await appendImage(imagesPreloaded,".chat-wrapper").then(scrollBottom);
    // }
    // await typeOutText.typeOut(`So... ${parseTrackName.parseTrack(tracks[1])}?`,".chat-wrapper",0).then(scrollBottom)
    // response = await appendOptions(["I love it","it's ok","I share this account with someone else"],".chat-wrapper")
    // incrementScore(55+Math.floor(Math.random()*10));

    // if(response[0] == "I love it"){
    //     await typeOutText.typeOut(`lol`,".chat-wrapper").then(scrollBottom)
    //     await sleeper(startingSleeperTime);
    //     await typeOutText.typeOut(`wait`,".chat-wrapper").then(scrollBottom)
    //     await sleeper(startingSleeperTime);
    //     await typeOutText.typeOut(`seriously?`,".chat-wrapper").then(scrollBottom)
    //     response = await appendOptions(["yes","lol no"],".chat-wrapper")
    //     if(response[0] == "yes"){
    //         await typeOutText.typeOut(`oh`,".chat-wrapper").then(scrollBottom)
    //         await sleeper(startingSleeperTime);
    //         await typeOutText.typeOut(`um`,".chat-wrapper").then(scrollBottom)
    //         await sleeper(startingSleeperTime);
    //         await typeOutText.typeOut(`awesome`,".chat-wrapper").then(scrollBottom)
    //     }
    //     else {
    //         await typeOutText.typeOut(`ha`,".chat-wrapper").then(scrollBottom)
    //     }
    // }
    // else if (response[0] == "it's okay"){
    //     await typeOutText.typeOut(`you just listen to it all the time?`,".chat-wrapper").then(scrollBottom)
    //     response = await appendOptions(["Yes","Not really"],".chat-wrapper")
    //     if(response[0] == "YES"){
    //         await typeOutText.typeOut(`thought so`,".chat-wrapper").then(scrollBottom)
    //     }
    //     else {
    //         await typeOutText.typeOut(`right...makes total sense`,".chat-wrapper").then(scrollBottom)
    //     }
    // }
    // else {
    //     await typeOutText.typeOut(`oh thank god`,".chat-wrapper").then(scrollBottom)
    // }

    // coverFlow.scrollTick(1)
    // await appendThinking(".chat-wrapper").then(scrollBottom)
    // await sleeper(2000);
    // await removeThinking(".chat-wrapper").then(scrollBottom)
    // await typeOutText.typeOut(`And there's ${parseTrackName.parseTrack(tracks[3])}.`,".chat-wrapper",2000).then(scrollBottom);
    // incrementScore(50+Math.floor(Math.random()*10));


    // await typeOutText.typeOut(`You've been listening to a lot of ${artistsRecent[0].name} lately.`,".chat-wrapper").then(scrollBottom)
    // if(artistsRecent[0].images.length > 0){
    //     imagesPreloaded = await preloadImages(artistsRecent.slice(0,1));
    //     await appendImage(imagesPreloaded,".chat-wrapper").then(scrollBottom);
    // }
    // await typeOutText.typeOut("u okay?",".chat-wrapper").then(scrollBottom)
    // response = await appendOptions(["Yeah why","Not really"],".chat-wrapper")
    // if(response[0] == "Yeah why"){
    //     await typeOutText.typeOut("i mean i guess everybody's different...",".chat-wrapper").then(scrollBottom)
    // }
    // else {
    //     await typeOutText.typeOut("listen i'm just a neural net do what you gotta do",".chat-wrapper").then(scrollBottom)
    // }

    // coverFlow.scrollTick(1)
    // await appendThinking(".chat-wrapper").then(scrollBottom)
    // await sleeper(2000);
    // await removeThinking(".chat-wrapper").then(scrollBottom)
    // await typeOutText.typeOut(`Of course ${artistsLong[8].name}.`,".chat-wrapper",1000).then(scrollBottom);
    // incrementScore(44+Math.floor(Math.random()*10));





























    // await appendImage(tracks[9].album.images[0].url,".chat-wrapper").then(scrollBottom);


    // await dataAppend(tracks.slice(0,10).map(function(d){ return parseTrackName.parseTrack(d); }));
    // await sleeper(1000);
    // await appendImage(tracks[9].album.images[0].url,".chat-wrapper").then(scrollBottom);
    // await sleeper(1000);

    // await sleeper(1000);
    // await appendOptions(["yes","no"],".chat-wrapper").then(scrollBottom);





    // await sleeper(1000);
    // await appendText("normal","Like all the way through?",".chat-wrapper").then(scrollBottom)
    // await sleeper(1000);
    // await appendOptions(["yes","no"],".chat-wrapper").then(scrollBottom);
    // await appendText("normal","Yea, cool. Maybe I should give it another chance.",".chat-wrapper").then(scrollBottom)
    // await sleeper(1000);
    // await appendText("normal","Alright maybe your top artists will be better.",".chat-wrapper").then(scrollBottom)
    // await sleeper(1000);
    // await appendText("normal","Let's look at your top 10 artists.",".chat-wrapper").then(scrollBottom)

    // await sleeper(2000);

    // await appendText("bold","top artists",".data-output")
    // await dataAppend(artists.slice(0,10).map( d => d.name));
    // await appendText("normal",`Finding a lot of ${artists.slice(0,1)[0].name}`,".chat-wrapper").then(scrollBottom);
    // await appendText("normal","Like... a LOT.",".chat-wrapper").then(scrollBottom)
    // await appendText("normal","I mean they're fine. But do you listen to anything else?").then(scrollBottom)




    // await sleeper(1000);
    // await sleeper(1000);
    // await appendText("normal","I mean they're fine but... come on.",".chat-wrapper").then(scrollBottom)
    // await sleeper(1000);
    // await appendText("normal","Alright I got one for you.",".chat-wrapper").then(scrollBottom)
    // await sleeper(1000);
    // await appendText("normal","Fuck marry kill. Choose fast.",".chat-wrapper").then(scrollBottom)
    // await sleeper(3000);

    // let imagesPreloaded = await preloadImages(artists.slice(1,4));
    // await fuckMarryKill([artists.slice(1,4),imagesPreloaded]).then(scrollBottom)
    // await sleeper(1000);
    // await appendThinking(".chat-wrapper").then(scrollBottom)
    // await sleeper(2000);
    // await removeThinking(".chat-wrapper").then(scrollBottom)
    // await sleeper(1000);
    // await appendThinking(".chat-wrapper").then(scrollBottom)
    // await sleeper(4000);
    // await removeThinking(".chat-wrapper").then(scrollBottom)

    // await appendText("normal","gross.",".chat-wrapper").then(scrollBottom)
    // await sleeper(2000);

    // await appendText("normal","so do you even know this song?",".chat-wrapper").then(scrollBottom)
    // await sleeper(2000);
    // await appendAudio("text",".chat-wrapper").then(scrollBottom);
    // await sleeper(2000);
    // responses = {"yes":"of course you do","no":"wow ok","duh":"ok good"}
    // input = await appendOptions(["yes","no","duh"],".chat-wrapper");
    // await scrollBottom();
    // stopPreview();


    // await appendThinking(".chat-wrapper").then(scrollBottom)
    // await sleeper(2000);
    // await removeThinking(".chat-wrapper").then(scrollBottom)
    // await sleeper(1000);

    // await appendText("normal",responses[input],".chat-wrapper").then(scrollBottom);

    // await sleeper(4000);

    // if(playlists.length > 0){

    //     await appendText("normal","Guess we should look at your playlists...",".chat-wrapper").then(scrollBottom)
    //     await sleeper(2000);

    //     await appendText("bold","recent playlists",".data-output").then(scrollBottom)
    //     await dataAppend(playlists.map( d => d.name))

    //     await appendText("normal",`Let's see: found your ${playlists.slice(0,1)[0].name} playlist`,".chat-wrapper").then(scrollBottom)
    //     await sleeper(4000);

    //     await appendText("normal","thumbing through the tracks...",".chat-wrapper").then(scrollBottom)
    //     await sleeper(2000);
    //     await appendText("bold",`${playlists.slice(0,1)[0].name} tracks`,".data-output")

    //     await dataAppend(playlists[0].trackArray.map(function(d){ return d; }).slice(0,10));
    //     await sleeper(2000);

    //     await appendText("normal","hm. bold choices",".chat-wrapper").then(scrollBottom)


    // }

    // await sleeper(2000);
    // await appendText("normal","alright that's enough. let's go to my thoughts",".chat-wrapper").then(scrollBottom)
    // await sleeper(2000);

    // return null;
}

export default { init };
