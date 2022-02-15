function setAnnounce(content){
    let atmp = document.createElement('div');
    content.appendChild(atmp);
    loadFile("README.md", (mdstr) => {
        atmp.innerHTML = window.markdownit().render(mdstr);
    });
    content.appendChild(document.createElement('p'));
}

let CURRENTPAGE = 1;
function setSubmit(content){
    let survey = getTSurvey();
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
    atmp.appendChild(btn);
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
    let emsg = document.createElement('p');
    emsg.style.color = "red";
    emsg.innerHTML = "";
    atmp.appendChild(emsg);
    content.appendChild(document.createElement('p'));
}

function setVote(content){
    let survey = getInitVSurvey();
    let report = getReport4Survey(survey);
    let atmp = document.createElement('div');
    atmp.id = "vote";
    content.appendChild(atmp);
    // Vote
    let gallery = document.createElement('div');
    gallery.id = "survey";
    gallery.innerHTML = "Loading...";
    atmp.appendChild(gallery);
    let title = document.createElement('h1');
    title.innerHTML = "";
    gallery.appendChild(title);
    let request = new XMLHttpRequest();
    request.open('GET', 'https://u2yg6jn33c.execute-api.us-east-1.amazonaws.com/default/vote-provider', true);
    request.onload = function(){
        if(this.status >= 200 && this.status < 400){
            let data = JSON.parse(this.response);
            console.log(data);
            for(let i = 0; i < data.length; i ++){
                survey['data'][0]['data']['selection'].push(data[i]);
            }
            report = getReport4Survey(survey);
            drawSurvey(survey, report);
            showPage(survey, CURRENTPAGE);
        }else{
            console.log(this);
        }
    };
    request.onerror = function(){
        console.log(this);
    };
    request.send();
    atmp.appendChild(document.createElement('hr'));
    let btn = document.createElement('button');
    btn.className = "w3-button w3-orange";
    btn.innerHTML = "Submit";
    atmp.appendChild(btn);
    btn.onclick = function(e){
        if(validatePage(survey, report)){
            if(confirm('Ready to Vote?')) {
                emsg.innerHTML = "Voting!";
                let request = new XMLHttpRequest();
                request.open('POST', 'https://d5jhh2scy8.execute-api.us-east-1.amazonaws.com/default/vote-capturer', true);
                request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                request.send(JSON.stringify(report));
                request.onload = function(){
                    if(this.status >= 200 && this.status < 400){
                        emsg.innerHTML = "Vote Finished!";
                        atmp.innerHTML = "You had completed the Vote!<br/>Thank you!"
                    } else {
                        emsg.innerHTML = "Vote Failed!";
                    }
                };
            }else{
                e.preventDefault();
            }
        }else{
            emsg.innerHTML = "Mandatory Questions Unfinished";
        }
    }
    let emsg = document.createElement('p');
    emsg.style.color = "red";
    emsg.innerHTML = "";
    atmp.appendChild(emsg);
    content.appendChild(document.createElement('p'));
}

function setResult(content){
    let atmp = document.createElement('div');
    atmp.id = "result";
    content.appendChild(atmp);
    result = {"-1": 0, "0": 0, "1": 0, "2": 0};
    // Vote
    let gallery = document.createElement('div');
    gallery.id = "survey";
    gallery.innerHTML = "Loading...";
    atmp.appendChild(gallery);
    let request = new XMLHttpRequest();
    request.open('GET', 'https://u2yg6jn33c.execute-api.us-east-1.amazonaws.com/default/result-provider', true);
    request.onload = function(){
        if(this.status >= 200 && this.status < 400){
            let data = JSON.parse(this.response);
            console.log(data);
            for(let k1 in result){
                result[k1] = 0;
            }
            for(let k2 in data){
                result[data[k2]] += 1;
            }
            gallery.innerHTML = JSON.stringify(result);
        }else{
            console.log(this);
        }
    };
    request.onerror = function(){
        console.log(this);
    };
    request.send();
    content.appendChild(document.createElement('p'));
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
    };
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

function getInitVSurvey(){
    return {
        "name": "T-shirt Vote",
        "id": "T-2",
        "version": "0",
        "time": (new Date()).getTime(),
        "text": "1 person has 1 vote.<br/>Please validate all submission before you vote.",
        "data": [{
            "name": "Vote for the T-shirt Design",
            "id": "T-2-Q-1",
            "type": "multi",
            "text": "There is an option to find a designer.",
            "must": true,
            "page": 1,
            "data": {
                "selection": [{
                    "id": "-1",
                    "text": "All Designs are Bad. Suggest to Find a Professional Designer."
                }]
            }
        }, {
            "name": "Your AWS Login, please.",
            "id": "T-2-Q-2",
            "type": "open",
            "text": "1 person will only be counted as 1 vote.",
            "must": true,
            "page": 1,
            "data": {
                "text": "Your ID without @amazon.com"
            }
        }]
    };
}
