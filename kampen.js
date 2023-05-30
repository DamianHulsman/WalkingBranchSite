async function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    const url = 'http://localhost/walkingBranchAPI/server.php?fn=login&username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);
    await $.getJSON(url, function (result) {
        console.log(result);
        if (result.success === true) {
            document.getElementById('loginform').classList.remove('loginform');
            document.getElementById('loginform').innerHTML = ``;
            document.getElementById('kampentable').classList.add('kampentable');
            document.getElementById('nav').innerHTML +=
            `<div class="navitem" onclick="document.location.replace('index.html')">Planning</div>
            <div class="navitem" onclick="document.location.replace('acties.html')">Acties</div>
            <div class="navitem" onclick="document.location.replace('kampen.html')">Kampen</div>
            <div class="navitem loginout" id="logout" onclick="logout()">Log uit</div>
            <div class="navitem">${result.username}</div>`;
            getTable(result);
        } else {
            alert('Invalid username/password!');
        }
    });
}

async function getTable(userdata) {
    let kampentable;
    if(userdata.success == true) {
        $.getJSON('http://localhost/walkingbranchAPI/server.php?fn=getKampen', function (result) {
            console.log(result);
            kampentable = `
            <tr class='kampitem'>
                <td><b>Naam</b></td>
                <td><b>Startdatum</b></td>
                <td><b>Einddatum</b></td>
            </tr>`;
            result.forEach(el => {
                kampentable += `
                <tr class='kampenitem'>
                    <td>${el.name}</td>
                    <td>${el.start}</td>
                    <td>${el.end}</td>
                </tr>`;
            });
            document.getElementById('kampentable').innerHTML = kampentable;
        });
    }
}

function logout() {
    document.getElementById('kampentable').innerHTML = ''; 
    document.getElementById('kampentable').classList.remove('kampentable')
    document.getElementById('nav').innerHTML =
        `
    <div id="loginform" class="loginform">
        <form>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required><br><br>

            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required><br><br>


        </form>
        <button onclick="login()" class="addbutton loginbutton">Login</button>
    </div>`;
}