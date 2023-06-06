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

let response;

async function getTable(userdata) {
    let kampentable;
    
    if(userdata.success == true) {
        const role = (userdata.role === 'admin' ? 'class="delbutton"' : 'class="diseditbutton" disabled');
        const role2 = (userdata.role === 'admin' ? 'class="editbutton"' : 'class="diseditbutton" disabled');
        $.getJSON('http://localhost/walkingbranchAPI/server.php?fn=getKampen', function (result) {
            console.log(result);
            response = result.length;
            kampentable = `
            <tr class='kampitem'>
                <td><b>Delete/Edit</b></td>
                <td><b>Naam</b></td>
                <td><b>Startdatum</b></td>
                <td><b>Einddatum</b></td>
            </tr>`;
            result.forEach(el => {
                kampentable += `
                <tr class='kampenitem' id='el${el.id}'>
                    <td>
                        <button ${role} onclick="deleteKamp(${el.id})" title="Verwijder dit kamp">Delete</button>
                        <button ${role2} onclick="editKamp(${el.id})" title="Bewerk dit kamp">Edit</button>
                    </td>
                    <td>${el.name}</td>
                    <td>${el.start}</td>
                    <td>${el.end}</td>
                </tr>`;
            });
            kampentable += 
            `
            <tr class='kampenitem'>
                <td><button class="addbutton" title="Kamp toevoegen" onclick="addKamp()">Toevoegen:</button></td>
                <td><input type="text" id="aName" class="addform" title="Naam van het kamp" placeholder="Naam"></td>
                <td><input type="date" id="aSdate" class="addform" title="Startdatum"></td>
                <td><input type="date" id="aEdate" class="addform" title="Einddatum"></td>
            </tr>
            `;
            document.getElementById('kampentable').innerHTML = kampentable;
        });
    }
}

async function addKamp() {
    const name = document.getElementById('aName').value;
    const sdate = document.getElementById('aSdate').value;
    const edate = document.getElementById('aEdate').value;
    const [day1, month1, year1] = sdate.split('-');
    const formattedDate1 = `${year1}-${month1}-${day1}`;
    const [day2, month2, year2] = edate.split('-');
    const formattedDate2 = `${year2}-${month2}-${day2}`;
    if(name !== '' && sdate !== '' && edate !== '') {
        $.getJSON(`http://localhost/walkingbranchAPI/server.php?fn=addKamp&id=${response + 1}&name=${name}&start=${formattedDate1}&end=${formattedDate2}`, function (result) {
            document.location.reload();
        });
    } else {
        alert('Vul alle velden in!');
    }
}

async function editKamp(id) {
    await $.getJSON(`http://localhost/walkingbranchAPI/server.php?fn=getKamp&id=${id}`, function (result) {
        const el = result[0];
        console.log(result);
        const startdate = el.start;
        const enddate = el.end;
        const [day1, month1, year1] = startdate.split('-');
        const formattedDate1 = `${year1}-${month1}-${day1}`;
        const [day2, month2, year2] = enddate.split('-');
        const formattedDate2 = `${year2}-${month2}-${day2}`;
        document.getElementById(`el${el.id}`).innerHTML = `
        <td>
            <button class="addbutton" onclick="saveKamp(${el.id})">Opslaan</button>
        </td>
        <td>
            <input type="text" class="addform" id='eName' value='${el.name}'>
        </td>
        <td>
            <input type="date" class="addform" id='eStart' value='${formattedDate1}'>
        </td>
        <td>
            <input type="date" class="addform" id='eEnd' value='${formattedDate2}'>
        </td>
        `;
    });
}

async function saveKamp(id) {
    const name = document.getElementById('eName').value;
    const startdate = document.getElementById('eStart').value;
    const enddate = document.getElementById('eEnd').value;
    const [day1, month1, year1] = startdate.split('-');
    const start = `${year1}-${month1}-${day1}`;
    const [day2, month2, year2] = enddate.split('-');
    const end = `${year2}-${month2}-${day2}`;
    if (name !== '' && start !== '' && end !== ''){
        await $.getJSON(`http://localhost/walkingbranchAPI/server.php?fn=editKamp&id=${id}&name=${encodeURIComponent(name)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`), function (result) {
            console.log(result);
            if(result.success === true) {
                document.location.reload();
            } else {
                alert('Kon niet bewerken');
            }
        }
    }
}

async function deleteKamp(id) {
    const confirmation = confirm('Weet je zeker dat je dit kamp wil verwijderen?');
    if (confirmation == true) {
        $.getJSON(`http://localhost/walkingbranchAPI/server.php?fn=delKamp&id=${id}`, function (result) {
            console.log(result);
            if(result.success == true) {
                document.location.reload();
            } else {
                alert('Delete failed!');
            }
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