var auth = WeDeploy.auth('auth-imageregister.wedeploy.sh');
var data = WeDeploy.data('data-imageregister.wedeploy.sh');

//auth
function signUp() {
    auth.createUser({
        email: user.email.value,
        name: user.name.value,
        password: user.password.value
    })
    .then(function() {
        alert('Account successfully created!');
        signIn();
        user.reset();
    })
    .catch(function() {
        alert('Sign-up failed. Try another email.');
        user.reset();
    });
}

function signIn() {
    auth.signInWithEmailAndPassword(user.email.value, user.password.value)
    .then(function() {
        document.location.href = '/images.html';
    })
    .catch(function() {
        alert('Sign-in failed. Try another email/password.');
    });
}

//document.querySelector('.username').innerHTML = auth.currentUser.name;

function signOut() {
	auth.signOut()
	.then(() => {
		location.href = '/';
	});
}

//data
var registerForm = document.querySelector('#register-form');

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    data.create('images', {name: registerForm.name.value, image: registerForm.base64.value, color: registerForm.color.value})
        .then(function(response) {
            registerForm.reset();
            registerForm.name.focus();
            loadDockerImages();
        })
        .catch(function(error) {
            console.error(error);
        });
});

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        var registerForm = document.querySelector('#register-form');
        registerForm.base64.value = reader.result;
    }
    reader.readAsDataURL(file);
}

window.onload = function(e){ 
    loadDockerImages();
}

function loadDockerImages() {
    return data.orderBy('name', 'desc')
        .get('images')
        .then(function(response) {
            appendImages(response);
        })
        .catch(function(error) {
            console.error(error);
        });
}

function appendImages(images) {
    var imagesList = '';

    images.forEach(function(image) {
        imagesList += `<div class="list-item">`;
        imagesList += `<div class="row">`;

        imagesList += `<div class="col-xs-3">`;
        imagesList += `<span class="avatar avatar-round avatar-medium" style="border:1px solid ${image.color}" />`;
        imagesList += `<img class="avatar-img" src="${image.image}" />`;
        imagesList += `</span>`;
        imagesList += `</div>`;
        
        imagesList += `<div class="col-xs-7">`;
        imagesList += `<span class="item-title">${image.name}</span>`;
        imagesList += `</div>`;

        imagesList += `<div class="col-xs-4">`;
        imagesList += `<span class="item-title">${image.color}</span>`;
        imagesList += `</div>`;

        imagesList += `<div class="col-xs-2 right">`;
        imagesList += `<button class="btn btn-squared" onclick="deleteImages('${image.id}')">`;
        imagesList += `<span class="icon-12-close-short"></span>`;
        imagesList += `</button>`;
        imagesList += `</div>`;

        imagesList += `</div>`;
        imagesList += `</div>`;
    });

    var list = document.querySelector('.images-list');
    list.innerHTML = imagesList;
}

function deleteImages(id) {
    data.delete(`images/${id}`)
        .then(function (item) {
            return loadDockerImages();
        });
}