var auth = WeDeploy.auth('auth-imageregister.wedeploy.sh');

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
