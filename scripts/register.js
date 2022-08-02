const server = 'http://localhost:8080'

var post_status = ''

//ΠΧ3
function register(event) {
    console.log("registerrr");

    var chk = checkInputs();
    console.log('valid inputs >'+chk);
    if (chk) {
        
        event.preventDefault();

        var myform = document.getElementById('register-form').getElementsByTagName('input');
        var formData = new Map();

        for (var i=0; i < (myform.length-1); i++) {
            var keystr = myform[i].name;
            var datastr = myform[i].value;
            formData.set(keystr, datastr);
        }
        
        var myinit = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Array.from(formData.entries()))
        };
        fetch(server+'/users/register', myinit).then(response => {
            console.log('response:'+response.status)
            setStatus(response.status)}).then(function() {

            if (post_status == 201) {
                //disable form
                var inputs = document.getElementsByTagName("input");
                for (var i=0; i<inputs.length; i++) {
                    inputs[i].setAttribute('disabled', true)
                }
                document.getElementById('register-bttn').setAttribute('disabled', true);
                document.getElementById('go-to-index-msg').innerHTML = 'Η δημιουργία χρήστη ολοκληρώθηκε. Μπορείτε να επιστρέψετε στην <a href="index.html">Αρχική Σελίδα</a>.';
            }
            else {
                document.getElementById('go-to-index-msg').innerHTML = 'Ο χρήστης είναι ήδη καταχωρημένος. Παρακαλώ επιλέξτε διαφορετικό e-mail.';
                document.getElementById('password').value = ''
                document.getElementById('chk-pw').value = ''
            }
        });
    }
    else {
        event.preventDefault();
    }

}

function checkInputs() {
    var inputs = document.getElementsByTagName("input");
    var error_line = document.getElementById('error-target');
    var pw_line = document.getElementById('pw-target');
    var error_str = '';
    var allgood = true;

    for (var i=0; i<inputs.length; i++) {
        if (!(inputs[i].checkValidity())) {
            allgood = false;
            error_str = error_str + " [" + inputs[i].previousElementSibling.previousElementSibling.textContent+"]";
        }
    }
    
    try {
        if (inputs[6].value !== inputs[7].value){
            error_str += " [Ασυμφωνία Κωδικού]"
            pw_line.innerHTML = 'Τα πεδία των κωδικών πρέπει να συμφωνούν!'
            allgood = false;
        }
        else {
            pw_line.innerHTML = '';
        }
    }   
    catch{
        console.log("empty password fields")
    }
    
    if (allgood) {
        document.getElementById('error-target').innerHTML = error_str;
        
        return true;
    }
    else {
        error_str = error_str  + ': υπάρχουν λάθη στα παραπάνω πεδία'
        error_line.innerHTML = error_str;
        return false;
    }
}

function setStatus(status) {
    post_status = status;
}