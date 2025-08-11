// ---- IMPORTANT: replace with your deployed Apps Script web app URL ----
const APPS_SCRIPT_URL = "YOUR_DEPLOY_URL_HERE";

const loginCard = document.getElementById('loginCard');
const profileCard = document.getElementById('profileCard');
const loginBtn = document.getElementById('loginBtn');
const startScanBtn = document.getElementById('startScanBtn');
const submitRemainingBtn = document.getElementById('submitRemainingBtn');
const logoutBtn = document.getElementById('logoutBtn');

let loggedInCoordinatorId = "";

loginBtn.addEventListener('click', login);
startScanBtn.addEventListener('click', () => document.getElementById('scanSection').classList.toggle('hidden'));
submitRemainingBtn.addEventListener('click', submitRemaining);
logoutBtn.addEventListener('click', logout);

function showMessage(id, text, isError){
  const el = document.getElementById(id);
  el.textContent = text || "";
  el.style.color = isError ? "#ffd2d2" : "";
}

async function login(){
  const id = document.getElementById('coordId').value.trim();
  const password = document.getElementById('password').value.trim();

  if(!id || !password){
    showMessage('loginMessage', 'Please enter ID and password', true);
    return;
  }

  showMessage('loginMessage', 'Logging in...');

  try {
    const resp = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', id, password }),
      credentials: 'omit'
    });

    const data = await resp.json();

    if(data && data.success){
      loggedInCoordinatorId = id;
      document.getElementById('coordName').textContent = data.name || id;
      document.getElementById('profilePic').src = data.photo || 'https://via.placeholder.com/100';
      document.getElementById('coordIdLabel').textContent = `ID: ${id}`;

      loginCard.classList.add('hidden');
      profileCard.classList.remove('hidden');
      showMessage('loginMessage', '');
    } else {
      showMessage('loginMessage', data.message || 'Invalid credentials', true);
    }
  } catch (err) {
    console.error('Login fetch error:', err);
    showMessage('loginMessage', 'Connection error. Open console for details', true);
  }
}

async function submitRemaining(){
  const qrCode = document.getElementById('qrCode').value.trim();
  const remaining = document.getElementById('remaining').value.trim();

  if(!qrCode || remaining === ''){
    showMessage('updateMessage', 'Please fill QR Code and remaining count', true);
    return;
  }

  showMessage('updateMessage', 'Submitting...');

  try {
    const resp = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'submit', qrCode, remaining: Number(remaining), coordinatorId: loggedInCoordinatorId }),
      credentials: 'omit'
    });

    const data = await resp.json();
    showMessage('updateMessage', data.message || (data.success ? 'Updated' : 'Error'), !data.success);
  } catch (err) {
    console.error('Submit fetch error:', err);
    showMessage('updateMessage', 'Connection error. Open console for details', true);
  }
}

function logout(){
  loggedInCoordinatorId = "";
  document.getElementById('coordId').value = '';
  document.getElementById('password').value = '';
  document.getElementById('qrCode').value = '';
  document.getElementById('remaining').value = '';

  profileCard.classList.add('hidden');
  loginCard.classList.remove('hidden');
}
