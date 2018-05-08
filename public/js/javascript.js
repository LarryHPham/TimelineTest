//declare global variables
var jsonUrl = "./json/data2.json";
var container = document.getElementById('container');
var checkboxSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 12.194v9.806h-20v-20h18.272l-1.951 2h-14.321v16h16v-5.768l2-2.038zm.904-10.027l-9.404 9.639-4.405-4.176-3.095 3.097 7.5 7.273 12.5-12.737-3.096-3.096z"/></svg>';
var lastColorStroke;
var colorHex = {
    red: '#af0000',
    green: '#38af00',
    white: '#ffffff',
    default: '#8e8e8e'
}

// declaration of functions

/***************************** runAPI ***************************
 * @function callEvent
 * function that makes an asynchronous request using http and setting a global variable equal to the response of the text.
 *
 * @param function jsonUrl - url of expected json response
 */
function callEvent(jsonUrl) { //Make it to where it is easy to be reused by anyone
    //variable that stores the response of an http request
    if (window.XMLHttpRequest) {
        var xhttp = new XMLHttpRequest();
    } else {
        var xhttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    xhttp.onreadystatechange = function() {
        // Check if the loading status of the current document is done
        if (this.readyState == 4) {
            if (this.status == 200) {
                // JSON RESPONSE SUCCESSFULL
                createEvent(JSON.parse(this.responseText));
            } else {
                // Error handling
                // Get the message
                if (this.status == 500) {
                    var msg = this.statusText;
                    try {
                        msg = JSON.parse(this.responseText).message
                    } catch (e) {
                        console.log("No JSON message")
                    }
                    msg = "HTTP Error (" + this.status + "): " + msg;
                    throw msg;
                }
            }
        }
    };
    xhttp.open("GET", jsonUrl, true);
    xhttp.send();
}

function createEvent(data) {
    if (!data.length) {
        throw "ERROR Expecting array";
        return;
    }

    data.forEach(function(val, index) {
        var el = document.createElement("div");
        el.className = "event-container";
        el.id = "ref-" + val.id;

        // append Timer element to div
        var timeEl = setEventTimeEl(val.time);
        el.appendChild(timeEl);

        // append the event icon type of event
        let typeEl = document.createElement("div");
        typeEl.className = "event-type";
        typeEl.appendChild(setEventIconEl(val));

        let haveStroke = index === (data.length - 1);
        typeEl.appendChild(setStrokeEl(val, haveStroke));
        el.appendChild(typeEl);

        // append the textbox info of event
        let textContainerEl = document.createElement("div");
        textContainerEl.className = "event-text-container";

        if (val.backgroundColor) {
            textContainerEl.className += " " + val.backgroundColor + "-background"; // predefined css classes
        }

        textContainerEl.appendChild(setEventTextboxEl(val));

        // append the evaluation data event
        if (val.evaluation) {
            textContainerEl.appendChild(setEvaluationEl(val));
        }

        el.appendChild(textContainerEl);

        container.appendChild(el);
    });

    //after container has been appended check for references
    setReference(data);

    // create debounce on window resize to set reference
    window.onresize = function () {
        if (window.debounce == false) {
            setReference(data);
            window.debounce = true;
        }
        clearTimeout(window.resizeDebounce);
        window.resizeDebounce = setTimeout(function () {
            window.debounce == false;
            setReference(data);
        }, 500);
    };
}

function setEventTimeEl(time) {
    // if time comes back as null stop function and return known error
    if (time === null) {
        // no time was given return N/A to display
        return "N/A";
    }
    let el = document.createElement("div");
    el.className = "event-time";
    el.innerHTML = "<span class='event-time-text'>" + secondsToString(time) + "</span>";
    return el;
}

function secondsToString(seconds) {
    // converts seconds into readable string HH:MM:SS
    var numhours = Math.floor((seconds % 86400) / 3600);
    var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    var numseconds = ((seconds % 86400) % 3600) % 60;

    //convert to readable format
    numhours = numhours > 9 ? numhours : "0" + numhours;
    numminutes = numminutes > 9 ? numminutes : "0" + numminutes;
    numseconds = numseconds > 9 ? numseconds : "0" + numseconds;

    return numhours + ":" + numminutes + ":" + numseconds;
}

function setEventIconEl(data) {
    // if iconText comes back as null stop function and return known error
    let el = document.createElement("div");
    el.className = "event-type-icon";

    if (!data.icon) {
        if (!data.lineColor) {
            el.style.boxShadow = 'inset 0 0 0 13px ' + colorHex.default;
        }
        // no time was given return N/A to display
        return el;
    }
    // add line box shadow color
    if (data.lineColor) {
        lastColorStroke = data.lineColor;
        el.style.boxShadow = 'inset 0 0 0 5px' + colorHex[data.lineColor];
    }

    // event icon between textbox and time
    if (data.icon) {
        let img = createSVGcon("./svgs/" + data.icon + ".svg");
        el.appendChild(img);
    }

    return el;
}

function setStrokeEl(data, lastStroke) {
    let el = document.createElement("div");
    el.className = "event-type-stroke";
    if (lastColorStroke) {
        el.style.borderLeft = !lastStroke ? "5px solid" + colorHex[lastColorStroke] : '';
    } else {
        el.style.borderLeft = !lastStroke ? "5px solid" + colorHex.default : '';
    }
    return el
}

function createSVGcon(url, color) {
    var svg = document.createElement("object");
    svg.setAttribute("data", url);
    svg.setAttribute("type", "image/svg+xml");
    svg.addEventListener("load", function(event) {
      var svgColor = color;
      var svgDoc = svg.contentDocument.getElementsByTagName('path')[0];
      svgDoc.setAttribute('fill', colorHex[svgColor]);
    });
    return svg;
}

function setEventTextboxEl(data) {
    let textBoxEl = document.createElement("div");
    textBoxEl.className = "event-textbox";

    // generate left box text description
    let leftBox = document.createElement("div");
    leftBox.className = "event-textbox-left";

    let leftBoxInnerHtml = "";

    // create data checks to generate html blocks if neccessary
    if (data.title) {
        leftBoxInnerHtml += "<h3 class='event-textbox-title'>" + data.title + "</h3>";
    }

    // add subtitle to textbox
    if (data.subtitle) {
        // check colors
        let subClass = data.color ? 'event-textbox-subtitle red' : 'event-textbox-subtitle';
        leftBoxInnerHtml += "<div class='" + subClass + "'>" + data.subtitle + "</div>";
    }

    // add notes to textbox
    if (data.notes) {
        leftBoxInnerHtml += "<div class='event-textbox-notes'>" + data.notes + "</div>";
    }
    leftBox.innerHTML = leftBoxInnerHtml;

    // generate right box icons
    let rightBox = document.createElement("div");
    rightBox.className = 'event-textbox-right';

    // judgement icon located top right of textbox
    if (data.judgmentIcon) {
        let img = createSVGcon("svgs/" + data.judgmentIcon + ".svg", data.color);
        rightBox.appendChild(img);
    }
    textBoxEl.appendChild(leftBox);
    textBoxEl.appendChild(rightBox);

    //add triangle class to box (place here to be centered with event-textbox)
    let triangleEl = document.createElement("div");
    triangleEl.className = "arrow-left";
    triangleEl.style.borderRight = data.backgroundColor ? "10px solid" + colorHex[data.backgroundColor] : "10px solid " + colorHex.white;
    textBoxEl.appendChild(triangleEl);

    return textBoxEl;
}

function setEvaluationEl(data) {
    if (!data) {
        return '';
    }

    let el = document.createElement("div");
    el.className = "event-evaluation";

    el.innerHTML = data.evaluation.text;

    let scoreEl = document.createElement('span');
    scoreEl.className = "event-evaluation-score";

    if (data.evaluation.maxScore) {
        scoreEl.innerHTML = data.evaluation.score + "/" + data.evaluation.maxScore;
    }

    if (data.evaluation.icon) {
        scoreEl.innerHTML += checkboxSVG;
    }

    // check colors
    if (data.color) {
        el.className += " red";
        scoreEl.className += " red-fill";
    }

    el.appendChild(scoreEl);

    return el;
}

function setReference(data){
    // waits 1 sec to make sure all data is entered
    setTimeout(function(){
      data.forEach(function(val, index) {
        if(val.references.length > 0){
          // if the reference link exists then
          if( document.getElementById('link-'+val.id) ){
            return;
          }

          var d = document.getElementById('ref-'+val.id);
          var valBoundary = d.getBoundingClientRect();

          val.references.forEach(function(v){
            if( val.id < v){
              // if the reference link exists between two nums then don't create another
              if( document.getElementById('link-'+val.id + '-' + v) ){
                return;
              }

              var dv = document.getElementById('ref-'+v);
              var dvBoundary = dv.getBoundingClientRect();
              var refLinkEl = document.createElement('div');

              // generate connection between two references
              refLinkEl.id = "link-" + val.id + '-' + v;
              refLinkEl.style.width = "20px";
              refLinkEl.style.height = ( dvBoundary.bottom - valBoundary.top ) - (valBoundary.height/2) - (dvBoundary.height/2) + "px";
              refLinkEl.style.borderTop = "4px solid " + colorHex.white;
              refLinkEl.style.borderRight = "4px solid " + colorHex.white;
              refLinkEl.style.borderBottom = "4px solid " + colorHex.white;
              refLinkEl.style.position = "absolute";
              refLinkEl.style.top = valBoundary.top + (valBoundary.height/2) + "px";
              refLinkEl.style.right = "20px";
              d.appendChild(refLinkEl);
            }
          });
        }
      });
    }, 1000);


}

// makes sure the main container exists to place event inside
// START OF EVENT
if (container) {
    callEvent(jsonUrl);
}
