function setAnnounce(content){
    let atmp = document.createElement('div');
    content.appendChild(atmp);
    loadFile("README.md", (mdstr) => {
        atmp.innerHTML = window.markdownit().render(mdstr);
    });
    content.appendChild(document.createElement('p'));
}

let survey = getTSurvey();
let CURRENTPAGE = getPages(survey)[0];
function setSubmit(content){
    let config = {};
    let atmp = document.createElement('div');
    atmp.id = "survey";
    content.appendChild(atmp);
    // Submit
    let report = getReport4Survey(survey);
    drawSurvey(survey, report);
    showPage(survey, CURRENTPAGE);
    atmp.appendChild(document.createElement('hr'));
    let btn = document.createElement('button');
    btn.className = "w3-button w3-orange";
    btn.innerHTML = "Submit";
    btn.onclick = function(e){
        if(validatePage(survey, report)){
            if(confirm('Ready for Submit?')) {
                emsg.innerHTML = "Submitting!";
                reportFileHandler(report, function(){
                    console.log(report);
                    let request = new XMLHttpRequest();
                    request.open('POST', 'https://d5jhh2scy8.execute-api.us-east-1.amazonaws.com/default/survey-capturer', true);
                    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                    request.send(JSON.stringify(report));
                    request.onload = function(){
                        if(this.status >= 200 && this.status < 400){
                            emsg.innerHTML = "Submission Finished!";
                            atmp.innerHTML = "You had completed the Design Submit!<br/>Thank you!"
                        } else {
                            emsg.innerHTML = "Submission Failed!";
                        }
                    };
                });
            }else{
                e.preventDefault();
            }
        }else{
            emsg.innerHTML = "Mandatory Questions Unfinished";
        }
    }
    atmp.appendChild(btn);
    let emsg = document.createElement('p');
    emsg.style.color = "red";
    emsg.innerHTML = "";
    atmp.appendChild(emsg);
    content.appendChild(document.createElement('p'));
}

function setVote(content){
}

function setResult(content){
}

// ------------------------------------- //

function getTSurvey(){
    let questions = [];
    // open
    questions.push({
        "name": "ID",
        "id": "T-1-Q-1",
        "type": "open",
        "text": "Please type in your Amazon Login without the '@amazon.com'",
        "must": true,
        "page": 1,
        "data": {
            "text": "Your ID without @amazon.com"
        }
    });
    // checkbox
    questions.push({
        "name": "Where do you learn about this T-shirt event?",
        "id": "T-1-Q-2",
        "type": "checkbox",
        "text": "Select the places where you saw this information.",
        "must": false,
        "page": 1,
        "data": {
            "selection": [{
                "id": "0",
                "text": "Direct Email"
            }, {
                "id": "1",
                "text": "LINE Group"
            }, {
                "id": "2",
                "text": "From colleague"
            }, {
                "id": "3",
                "text": "I have no idea"
            }, {
                "id": "4",
                "text": "Other methods"
            }]
        }
    });
    // upload
    questions.push({
        "name": "Upload the Design!",
        "id": "T-1-Q-3",
        "type": "capture",
        "text": "We only accept 1 upload file. If there are multiple files, please combine those into 1.<br/>File size is limited to 1.5 MB.",
        "must": true,
        "page": 1,
        "data": {
            "multiple": false
        }
    });
    // open
    questions.push({
        "name": "The design story?",
        "id": "T-1-Q-4",
        "type": "open",
        "text": "We will like to know more about your design. Is there a story that you will like to tell us?",
        "must": false,
        "page": 1,
        "data": {
            "text": "Write your story!"
        }
    });
    // rating
    questions.push({
        "name": "Tell us your experience!",
        "id": "T-1-Q-5",
        "type": "rating",
        "text": "We appreciate your feedback for us to improve!",
        "must": true,
        "page": 1,
        "data": {
            "scale": 10,
            "left": "Bad",
            "right": "Good"
        }
    });
    return {
        "name": "T-shirt Survey",
        "id": "T-1",
        "version": "0",
        "time": (new Date()).getTime(),
        "text": "The design submission is included in the survey.",
        "data": questions
    }
}

function reportFileHandler(report, cb){
    let file = report['data'][2]['data'][0];
    console.log(file);
    let fileName = file.name;
    let reader = new FileReader();
    reader.onload = function(){
        let filestr = this.result;
        report['data'][2]['data'] = filestr;
        cb();
    }
    reader.readAsDataURL(file);
}
