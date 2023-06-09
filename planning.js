let planningarray;
let userrole;
let username;
const date = new Date();
const fulldate = `${date.getDate()}-0${date.getMonth() + 1}-${date.getFullYear()}`;

function getTable(role, username) {
    $.getJSON('http://localhost/WalkingBranchAPI/server.php?fn=getPlanning', function (planning) {
        console.log(planning);
        planningarray = planning;
        setPlanning(planning, role, username);
    });
}

function setPlanning(planning, role, username) {
    let table = `
    <tr class="tableheader">
        <td class="tableitem">
            <b>Delete/Edit</b>
        </td>
        <td class="tableitem">
            <b>Datum</b>
        </td>
        <td class="tableitem">
            <b>Organisatie</b>
        </td>
        <td class="tableitem notes">
            <b>Activiteit</b>
        </td>
        <td class="tableitem">
            <b>Kosten</b>
        </td>
        <td class="tableitem notes">
            <b>Notities</b>
        </td>
        <td class="tableitem">
        </td>
    </tr>`;
    if (role === 'peasant') {
        planning.forEach(el => {
            let disabledAttr;
            let toggledelete;
            let currentdate = '';
            if(el.date == fulldate) {
                currentdate = 'currentdate';
            }

            if(el.organisatie.includes(username) == true) {
                disabledAttr = 'class="editbutton"';
                toggledelete = 'class="delbutton"'; 
            } else {
                disabledAttr = 'disabled class="diseditbutton"'; // Add the disabled attribute if the disabled property is true
                toggledelete = 'disabled class="diseditbutton"';
            }
            table +=
            `
            <tr class="tablerow" id="e${el.id}">
                <td class="tableitem">
                    <button title="Verwijder deze opkomst" onclick="delitem(${el.id})" ${toggledelete}>Delete</button>
                    <button title="Bewerk deze opkomst" onclick="edititem(${el.id})" ${disabledAttr}>Edit</button>
                </td>
                <td class="tableitem ${currentdate}">${el.date}</td>
                <td class="tableitem">${el.organisatie}</td>
                <td class="tableitem">${el.activity}</td>
                <td class="tableitem">€${el.cost}</td>
                <td class="tableitem">${el.notes}</td>
            </tr>`;
        });
    } else if (role === 'admin') {
        planning.forEach(el => {
            let currentdate = '';
            if(el.date == fulldate) {
                currentdate = 'currentdate';
            }
            table +=
                `
            <tr class="tablerow" id="e${el.id}">
                <td class="tableitem">
                    <button class="delbutton" title="Verwijder deze opkomst" onclick="delitem(${el.id})">Delete</button>
                    <button title="Bewerk deze opkomst" onclick="edititem(${el.id})" class="editbutton">Edit</button>
                </td>
                <td class="tableitem ${currentdate}">${el.date}</td>
                <td class="tableitem">${el.organisatie}</td>
                <td class="tableitem">${el.activity}</td>
                <td class="tableitem">€${el.cost}</td>
                <td class="tableitem">${el.notes}</td>
            </tr>`;
        });
    } else {
        alert('Je moet eerst inloggen!');
        return;
    }

    table += 
    `
    <tr class="tablerow">
        <td class="tableitem">
            <button class="addbutton" title="Opkomst toevoegen" onclick="additem()">Toevoegen:</button>
        </td>
        <td class="tableitem">
            <input type="date" title="Datum" class="addform" id="aDate" placeholder="Datum: x-xx-2023" required>
        </td>
        <td class="tableitem">
            <input type="text" title="Wie organiseert de opkomst" class="addform" id="aOrganisatie" placeholder="Organisatie" required>
        </td>
        <td class="tableitem">
            <input type="text" title="Korte omschrijving van het programma" class="addform" id=aActivity placeholder="Activiteit" required>
        </td>
        <td class="tableitem">
            <input type="number" title="Kosten" class="addform" id="aCost" value=0 style="width: 50px;" required>
        </td>
        <td class="tableitem">
            <input type="text" title="Evt. notities" class="addform" id=aNotes placeholder="Notities">
        </td>
    </tr>`;

    if (document.getElementById('planning')) {
        document.getElementById('planning').innerHTML = table;
    }
}


function delitem(id) {
    const confirmation = confirm('Weet je zeker dat je deze opkomst wilt verwijderen?');
    if (confirmation == true) {
        $.getJSON(`http://localhost/WalkingBranchAPI/server.php?fn=deleteItem&id=${id}`, function (result) {
            console.log(result);
        });
        document.location.reload();
    }
}

function additem() {
    const confirmation = confirm('Toevoegen?');
    if (confirmation == true) {
        const id = planningarray.length + 1;
        const date = document.getElementById('aDate').value;
        const splittedDate = date.split('-');
        const formattedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
        const organisatie = document.getElementById('aOrganisatie').value;
        const activity = document.getElementById('aActivity').value;
        const cost = document.getElementById('aCost').value;
        const notes = document.getElementById('aNotes').value;

        if (date !== '' && organisatie !== '' && activity !== '' && cost !== '') {
            $.getJSON(`http://localhost/WalkingBranchAPI/server.php?fn=addItem&id=${id}&date=${formattedDate}&organisatie=${organisatie}&activity=${activity}&cost=${cost}&notes=${notes}&disabled=true`, function (result) {
                console.log(result);
            });
            document.location.reload();
        } else {
            document.getElementById('aDate').style.border = '2px solid red';
            document.getElementById('aOrganisatie').style.border = '2px solid red';
            document.getElementById('aActivity').style.border = '2px solid red';
            setTimeout(() => {
                alert('Vul alle velden in!');
            }, 500);


        }
    }
}

function edititem(id) {
    const itemIndex = planningarray.findIndex(item => item.id === id);
    if (itemIndex === -1) {
        console.log(`Item with id ${id} not found.`);
    }
    const currentItem = planningarray[itemIndex];
    const date = currentItem.date;
    const [day, month, year] = date.split('-');
    const formattedDate = `${year}-${month}-${day}`;

    // create an input form with the current values of the item
    const form = `
        <form>
            <label for="eDate">Datum:</label>
            <input type="date" id="eDate" value="${formattedDate}" required><br>

            <label for="eOrganisatie">Organisatie:</label>
            <input type="text" id="eOrganisatie" value="${currentItem.organisatie}"><br>

            <label for="eActivity">Activiteit:</label>
            <input type="text" id="eActivity" value="${currentItem.activity}" required><br>

            <label for="eCost">Kosten:</label>
            <input type="number" id="eCost" value="${currentItem.cost}" style="width: 50px;"><br>

            <label for="eNotes">Notities:</label>
            <input type="text" id="eNotes" value="${currentItem.notes}"><br>
            <button type="submit" onclick="saveitem(${id})" class="savebutton">Opslaan</button>
            <button type="button" onclick="cancelEdit()" class="cancelbutton">Annuleren</button>
        </form>
    `;

    // replace the row with an input form
    document.getElementById(`e${id}`).innerHTML = `<td colspan="7">${form}</td>`;
}

async function saveitem(id) {
    const itemIndex = planningarray.findIndex(item => item.id === id);
    if (itemIndex === -1) {
        console.log(`Item with id ${id} not found.`);
        return;
    }

    const date = document.getElementById('eDate').value;
    const splittedDate = date.split('-');
    const formattedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`
    const organisatie = document.getElementById('eOrganisatie').value;
    const activity = document.getElementById('eActivity').value;
    const cost = document.getElementById('eCost').value;
    const notes = document.getElementById('eNotes').value;
    const disabled = true;

    if (date !== '' && activity !== '' && organisatie !== '' && cost !== '') {
        const updatedItem = {
            ...planningarray[itemIndex],
            date,
            organisatie,
            activity,
            cost,
            notes,
            disabled
        };
        planningarray[itemIndex] = updatedItem;
        $.getJSON(`http://localhost/WalkingBranchAPI/server.php?fn=editItem&id=${id}&date=${encodeURIComponent(formattedDate)}&organisatie=${encodeURIComponent(organisatie)}&activity=${encodeURIComponent(activity)}&cost=${cost}&notes=${encodeURIComponent(notes)}&disabled=${disabled}`, function (result) {
            console.log(result);
        });
        document.location.reload();
    } else {
        alert('Vul alle velden in!');
    }
}

function cancelEdit() {
    setPlanning(planningarray, userrole);
}

async function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    const url = 'http://localhost/walkingBranchAPI/server.php?fn=login&username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);

    await $.getJSON(url, function (result) {
        console.log(result);
        if (result.success === true) {
            getTable(result.role, result.username);
            userrole = result.role;
            document.getElementById('loginform').classList.remove('loginform');
            document.getElementById('loginform').innerHTML = ``;
            document.getElementById('nav').innerHTML += 
            `<div class="navitem" onclick="document.location.replace('index.html')">Planning</div>
            <div class="navitem" onclick="document.location.replace('acties.html')">Acties</div>
            <div class="navitem" onclick="document.location.replace('kampen.html')">Kampen</div>
            <div class="navitem loginout" id="logout" onclick="logout()">Log uit</div>
            <div class="navitem">${result.username}</div>`;
        } else {
            alert('Invalid username/password!');
        }
    });
}

function logout() {
    document.getElementById('planning').innerHTML = '';
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