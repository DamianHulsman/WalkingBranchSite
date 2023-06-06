let user;
let myshifts;

async function getActies(success) {
    if (success === true) {
        await $.getJSON('http://localhost/walkingBranchAPI/server.php?fn=getActies', function (result) {
            console.log(result);
            getTable(result);
        });
    }
}

function getTable(actiedata) {
    let table = `
    <tr class="actietable">
        <td class="theader"><b>Actie</b></td>
        <td class="theader"><b>Loon per uur</b></td>
        <td class="theader"><b>Shifts</b></td>
    </tr>`;

    const data = actiedata.data;

    for (let index = 0; index < data.length; index++) {
        let shift = '';
        const el = data[index];
        shift += '<ul>';

        el.dates.forEach(subdates => {

            shift += `
            <li><b>${subdates.datum}</b></li>
            <ul>`;

            subdates.times.forEach(subtime => {
                shift += `<li>${subtime.time}</li>`

            });
            shift += '</ul><br>';

        });

        shift += '</ul>';
        table += `
        <tr class="actietr">
            <td class="actieitem text-center">${el.name}</td>
            <td class="actieitem text-center">${el.loon}</td>
            <td class="actieitem">${shift}</td>
        </tr>`;
    }

    document.getElementById('actietable').innerHTML = table;
}

function editMyShifts() {
    document.getElementById('myshifts').innerHTML =
        `
    <h4 style="text-align: center;">Mijn shifts</h4>
    <b><img src="./assets/hr.png"> = lijn</b><br>
    <b><img src="./assets/br.png"> = nieuwe regel</b><br>
    <textarea id='editshiftinput' style="width: 300px !important; height: 200px !important; transition: 0s;">${myshifts}</textarea><br>
    <button onclick='saveshifts()' class='addbutton' style='width: fit-content; text-align: center;'>Opslaan</button>
    `;
}

async function saveshifts() {
    const editedshift = document.getElementById('editshiftinput').value;
    await $.getJSON(`http://localhost/walkingBranchAPI/server.php?fn=editMyshift&username=${user}&actieshifts=${encodeURIComponent(editedshift)}`, function (result) {
    });

    document.location.reload();
}

async function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    await $.getJSON('http://localhost/walkingBranchAPI/server.php?fn=login&username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password), function (result) {
        console.log(result);
        if (result.success === true) {
            getActies(result.success);
            document.getElementById('loginform').classList.remove('loginform');
            document.getElementById('loginform').innerHTML = ``;
            document.getElementById('actietable').classList.add('actietable');
            document.getElementById('myshifts').classList.add('myshifts');
            document.getElementById('myshifts').innerHTML = `<h4 style="text-align: center;">Mijn shifts</h4>`;

            document.getElementById('nav').innerHTML +=
                `<div class="navitem" onclick="document.location.replace('index.html')">Planning</div>
            <div class="navitem" onclick="document.location.replace('acties.html')">Acties</div>
            <div class="navitem" onclick="document.location.replace('kampen.html')">Kampen</div>
            <div class="navitem loginout" id="logout" onclick="logout()">Log uit</div>
            <div class="navitem">${result.username}</div>`;
            document.getElementById('myshifts').innerHTML += `${result.actieshifts}`;
            document.getElementById('myshifts').innerHTML += `<br><br><button onclick='editMyShifts()' class='editbutton' style='width: fit-content; text-align: center;'>Bewerken</button>`;
            myshifts = `${result.actieshifts}`;
            user = result.username;
        } else {
            alert('Invalid username/password!');
        }
    });
}

function logout() {
    document.getElementById('actietable').innerHTML = '';
    document.getElementById('actietable').classList.remove('actietable');
    document.getElementById('myshifts').innerHTML = '';
    document.getElementById('myshifts').classList.remove('myshifts');

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