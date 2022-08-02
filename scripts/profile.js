const server = 'http://localhost:8080'

var post_status = ''

var user = {
    fname:'Default',
    lname: 'User',
    tel: 'XXXXXXXXXX',
    adr: 'Some-Address',
    edu: 'Education-Level'
}

//ΠΧ4
function validateUser(event) {
    console.log("profileee")
    event.preventDefault()

    var userprofile = document.getElementById('profile-info')
    var credentials = {
        username:document.getElementById('email').value,
        password:document.getElementById('password').value
    }
   
    var chk = checkInputs(credentials);

    if (chk) {

        profileTemplate(userprofile)
        fetchUser(credentials)
    }
    else {
        userprofile.innerHTML = 'invalid input'
    }
    
    
}

function profileTemplate(div) {

    var template = document.getElementById('profile-template').innerHTML;
    var compiledTemplt = Handlebars.compile(template);
    var content = compiledTemplt(user);

    div.innerHTML = content;

}

function checkInputs(creds) {
    
    if ((creds.username == '')||(creds.password == '')) {
        console.log('empty fields')
        return false
    }
    return true

}

function updateUserInfo(data) {
    user.fname = data.fname
    user.lname = data.lname
    user.tel = data.phone
    user.adr = data.adr
    user.edu = data.edulvl
}

async function fetchUser(creds) {
    var target = document.getElementById('profile-info')
    var myinit = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(creds)
    };
    console.log('sending '+myinit.body)

    let response = await  fetch(server+'/users/validate', myinit);

    console.log(response.status);
    console.log(response.statusText);

    switch(response.status) {
        case 200:
            let data = await response.json()
            console.log('will look for user with id='+data.userid)
            let userprof = await  fetch(server+'/users/profile/'+data.userid, {method: "GET", headers: {'Accept':'application/json'}});
            let info = await userprof.json()
            
            updateUserInfo(info)
            profileTemplate(target)
            
            break;
        case 400:
            target.innerHTML = 'Wrong email or password'
            break;
        default:
            target.innerHTML = 'Something went wrong'
    }


}

function setStatus(status) {
    post_status = status;
}