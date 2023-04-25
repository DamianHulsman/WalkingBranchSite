let planningarray;
function getTable() {
    $.getJSON('http://localhost/WalkingBranchAPI/server.php?fn=getPlanning', function (planning) {
        console.log(planning);
        planningarray = planning;
        setPlanning(planning);
    });
}
function setPlanning(planning) {
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
        <td class="tableitem">
            <b>Activiteit</b>
        </td>
        <td class="tableitem">
            <b>Kosten</b>
        </td>
        <td class="tableitem">
            <b>Notities</b>
        </td>
        <td class="tableitem">
            <b>Disabled</b>
        </td>
    </tr>`;

    planning.forEach(el => {
        const disabledAttr = el.disabled ? 'disabled ' : 'class="editbutton"'; // Add the disabled attribute if the disabled property is true
        table += 
        `
        <tr class="tablerow" id="e${el.id}">
            <td class="tableitem">
                <button class="delbutton" title="Verwijder deze opkomst" onclick="delitem(${el.id})">Delete</button>
                <button title="Bewerk deze opkomst" onclick="edititem(${el.id})" ${disabledAttr}>Edit</button>
            </td>
            <td class="tableitem">${el.date}</td>
            <td class="tableitem">${el.organisatie}</td>
            <td class="tableitem">${el.activity}</td>
            <td class="tableitem">€${el.cost}</td>
            <td class="tableitem">${el.notes}</td>
            <td class="tableitem">${el.disabled}</td>
        </tr>`;
    });

    table += `<tr class="tablerow"><td class="tableitem"><button class="addbutton" onclick="additem()">Toevoegen:</button></td><td class="tableitem"><input type="text" id="aDate" placeholder="Datum: x-xx-2023" required></td><td class="tableitem"><input type="text" id="aOrganisatie" placeholder="Organisatie"></td><td class="tableitem"><input type="text" id=aActivity placeholder="Activiteit" required></td><td class="tableitem"><input type="number" id=aCost placeholder="Kost" value=0 style="width: 50px;" required></td><td class="tableitem"><input type="text" id=aNotes placeholder="Notities"></td><td class="tableitem">Disabled: <input type="checkbox" id=aDisabled required></td></tr>`;

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
        const organisatie = document.getElementById('aOrganisatie').value;
        const activity = document.getElementById('aActivity').value;
        const cost = document.getElementById('aCost').value;
        const notes = document.getElementById('aNotes').value;
        let dis;
        if (document.getElementById('aDisabled').value == true) {
            dis = false;
        } else {
            dis = true;
        }
        if (date !== '' && organisatie !== '' && activity !== '' && cost !== '') {
            $.getJSON(`http://localhost/WalkingBranchAPI/server.php?fn=addItem&id=${id}&date=${date}&organisatie=${organisatie}&activity=${activity}&cost=${cost}&notes=${notes}&disabled=${dis}`, function (result) {
                console.log(result);
            });
            document.location.reload();
        } else {
            alert('Vul alle velden in!');
            document.getElementById('aDate').style.border = '2px solid red';
            document.getElementById('aOrganisatie').style.border = '2px solid red';
            document.getElementById('aActivity').style.border = '2px solid red';
        }
    }
}

function edititem(id) {
    const itemIndex = planningarray.findIndex(item => item.id === id);
    if (itemIndex === -1) {
        console.log(`Item with id ${id} not found.`);
        return;
    }

    const currentItem = planningarray[itemIndex];

    // create an input form with the current values of the item
    const form = `
        <form>
            <label for="eDate">Datum:</label>
            <input type="text" id="eDate" value="${currentItem.date}" required><br>

            <label for="eOrganisatie">Organisatie:</label>
            <input type="text" id="eOrganisatie" value="${currentItem.organisatie}"><br>

            <label for="eActivity">Activiteit:</label>
            <input type="text" id="eActivity" value="${currentItem.activity}" required><br>

            <label for="eCost">Kosten:</label>
            <input type="number" id="eCost" value="${currentItem.cost}" style="width: 50px;" required><br>

            <label for="eNotes">Notities:</label>
            <input type="text" id="eNotes" value="${currentItem.notes}" required><br>

            <label for="eDisabled">Disabled:</label>
            <input type="checkbox" id="eDisabled" ${currentItem.disabled ? 'checked' : ''}><br>

            <button type="submit" onclick="saveitem(${id})">Opslaan</button>
            <button type="button" onclick="cancelEdit()">Annuleren</button>
        </form>
    `;

    // replace the row with an input form
    const table = document.getElementById('planning');
    document.getElementById(`e${id}`).innerHTML = `<td colspan="7">${form}</td>`;
}

function saveitem(id) {
    const itemIndex = planningarray.findIndex(item => item.id === id);
    if (itemIndex === -1) {
        console.log(`Item with id ${id} not found.`);
        return;
    }

    const date = document.getElementById('eDate').value;
    const organisatie = document.getElementById('eOrganisatie').value;
    const activity = document.getElementById('eActivity').value;
    const cost = document.getElementById('eCost').value;
    const notes = document.getElementById('eNotes').value;
    const disabled = document.getElementById('eDisabled').checked;

    if (date !== '' && activity !== '' && organisatie !== '') {
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

        $.getJSON(`http://localhost/WalkingBranchAPI/server.php?fn=editItem&id=${id}&date=${date}&organisatie=${organisatie}&activity=${activity}&cost=${cost}&notes=${notes}&disabled=${disabled}`, function (result) {
            console.log(result);
        });
        setPlanning(planningarray);
    } else {
        alert('Vul alle velden in!');
    }
}

function cancelEdit() {
    setPlanning(planningarray);
}


async function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    const url = 'http://localhost/walkingBranchAPI/server.php?fn=login&username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);
    await $.getJSON(url, function (result) {
        console.log(result);
        if(result.success === true) {
            getTable();
            document.getElementById('loginform').innerHTML = ``;
            document.getElementById('nav').innerHTML += `<button class="navitem" onclick="logout()">Log uit</button>`;
        } else {
            alert('Invalid username/password!');
        }
    });
}

function logout() {

}