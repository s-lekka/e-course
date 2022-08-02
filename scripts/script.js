window.onload = init;

var url='https://elearning-aueb.herokuapp.com';
var keyword='';

function init() {
    
    const urlParams = new URLSearchParams(window.location.search);

    //ΠΧ4
    if (window.location.pathname.includes('profile.html')) {
        document.getElementById("profile-bttn").addEventListener('click', validateUser);
    }

    //ΠΧ3
    if (window.location.pathname.includes('register.html')) {
        document.getElementById("register-bttn").addEventListener('click', register);
    }

    //ΠΧ2
    if (window.location.pathname.includes('courses.html')) {
        try {
            var categoryID = urlParams.get('category');
            fetch(url+'/categories', init).then(response => response.json()).then(obj => {
                enterTitle(obj, categoryID)
            }).catch(error => {console.log(error)})
            loadByCategory(categoryID);
        }catch{}
    }
    
    //ΠΧ2
    categoriesMenu();


    //ΠΧ1
    if (window.location.pathname.includes('index.html')) {
        document.getElementById("search-button").addEventListener('click', getKeyword);
    }
    
}

//ΠΧ1
function getKeyword() {
    keyword = document.getElementById('search-text').value;

    var myHeaders = new Headers();
    myHeaders.append('Accept','application/json');

    var init = {
        method: "GET", headers: myHeaders
    }

    fetch(url+'/courses/search?title='+keyword, init).then(response => response.json()).then(obj => {
        loadCourses(obj, false)
    }).catch(error => {console.log(error)})

}

//ΠΧ1
function loadCourses(obj, id) {

    var coursesList = obj;

    var template = document.getElementById('courses-template').innerHTML;
    var compiledTemplt = Handlebars.compile(template);
    var rendered = compiledTemplt({courses: coursesList});

    document.getElementById('courses-target').innerHTML = rendered;

    if (coursesList.length == 0) {
        if (id) {
            document.getElementById('courses-target').innerHTML = "No courses in category";
        }
        else {
            document.getElementById('courses-target').innerHTML = "No courses containing keyword \""+keyword+'\"'; 
        }
    }

}


//ΠΧ2
function categoriesMenu() {
    var myHeaders = new Headers();
    myHeaders.append('Accept','application/json');

    var init = {
        method: "GET", headers: myHeaders
    }

    fetch(url+'/categories', init).then(response => response.json()).then(obj => {
        loadCategories(obj)
    }).catch(error => {console.log(error)})

}

//ΠΧ2
function loadCategories(obj) {
    let categoriesList = obj;

    let template = document.getElementById('categories-template').innerHTML;
    let compiledTemplt = Handlebars.compile(template);
    let rendered = compiledTemplt({categories: categoriesList});

    document.getElementById('categories-target').innerHTML = rendered;

    if (categoriesList.length == 0) {
        document.getElementById('categories-target').innerHTML = "no categories";
    }
}

//ΠΧ2
function loadByCategory(id) {
    var myHeaders = new Headers();
    myHeaders.append('Accept','application/json');

    var init = {
        method: "GET", headers: myHeaders
    }

    fetch(url+'/courses/search?category='+id, init).then(response => response.json()).then(obj => {
        loadCourses(obj, true)
    }).catch(error => {console.log(error)})
}

function enterTitle(obj, id) {
    let categoriesList = obj;

    let template = document.getElementById('title-template').innerHTML;
    let compiledTemplt = Handlebars.compile(template);
    let rendered = compiledTemplt(categoriesList[id-1]);

    document.getElementById('title-target').innerHTML = rendered;

}