console.log("code.js loaded");
const urlBase = 'http://www.small-project-team6.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

let currentPage = 1;
const contactsPerPage = 10; // change as needed
let allContacts = [];       // stores contacts after load

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	
	if (login.trim() === "" || password.trim() === "") {
		document.getElementById("loginResult").innerHTML = "Please enter both username and password.";
		return;
	}

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contact-app.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignup()
{
    let firstName = document.getElementById("signupFirstName").value;
    let lastName = document.getElementById("signupLastName").value;
    let login = document.getElementById("signupName").value;
    let password = document.getElementById("signupPassword").value;

    document.getElementById("signupResult").innerHTML = "";

    let tmp = {firstName:firstName, lastName:lastName, login:login, password:password};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
            let jsonObject = JSON.parse(xhr.responseText);

            if(jsonObject.error !== "") 
            {
                document.getElementById("signupResult").innerHTML = jsonObject.error;
            } 
            else 
            {
                // Registration successful → switch to login form
                switchToLogin();
            }
        }
    };

    xhr.send(jsonPayload);
}

function addContact() {
	readCookie(); // make sure userId is up to date

	let firstName = document.getElementById("contactTextFirst").value.trim();
	let lastName = document.getElementById("contactTextLast").value.trim();
	let email = document.getElementById("contactTextEmail").value.trim();
	let phone = document.getElementById("contactTextNumber").value.trim();
  
	// Clear result area (we can add a <div id="contactAddResult"> later if needed)
	console.log("Adding contact:", firstName, lastName, email, phone);
  
	document.getElementById("addContactResult")?.remove();

    let resultP = document.createElement("p");
    resultP.id = "addContactResult";
    document.getElementById("addContactSection").appendChild(resultP);

	let tmp = {
	  FirstName: firstName,
	  LastName: lastName,
	  Email: email,
	  Phone: phone,
	  UserId: userId
	};

	console.log("Payload:", tmp); // debug
  
	let jsonPayload = JSON.stringify(tmp);
  
	let url = urlBase + '/Add_Contact.' + extension;
  
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
	try {
	  xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		  console.log("Response:", xhr.responseText);
		  let jsonObject = JSON.parse(xhr.responseText);
  
		  if (jsonObject.error && jsonObject.error !== "") {
			alert("Error: " + jsonObject.error);
			return;
		  }
  
		  alert("Contact added successfully!");
		  loadContacts();  // refresh the table
		  toggleAddForm(); // hide the form
		}
	  };
	  console.log("Payload being sent:", jsonPayload);
	  xhr.send(jsonPayload);
	}
	catch(err) {
	  alert("Error: " + err.message);
	}
}
  
function loadContacts() {
    let tmp = { search: "", userId: userId }; // empty search loads all
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contacts:", xhr.responseText);
                let jsonObject = JSON.parse(xhr.responseText);

                let tbody = document.getElementById("tbody");
                tbody.innerHTML = "";

				if (jsonObject.results && jsonObject.results.length > 0) {
					allContacts = jsonObject.results;
					console.log("Total contacts loaded:", allContacts.length); // debug
					currentPage = 1;           // reset to first page
					displayContacts();          // render first page
					renderPagination();         // render pagination buttons
				} else {
					const tbody = document.getElementById("tbody");
					tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No contacts found</td></tr>`;
				}
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err) {
        console.log("Error:", err.message);
    }
}

function displayContacts() {
    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * contactsPerPage;
    const end = start + contactsPerPage;
    const pageContacts = allContacts.slice(start, end);

    if (pageContacts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No contacts found</td></tr>`;
        return;
    }

    pageContacts.forEach(contact => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${contact.FirstName}</td>
            <td>${contact.LastName}</td>
            <td>${contact.Email}</td>
            <td>${contact.Phone}</td>
            <td></td>
        `;

        let updateBtn = document.createElement("button");
        updateBtn.textContent = "Update";
        updateBtn.addEventListener("click", () => {
            updateContact(contact.ID, contact.FirstName, contact.LastName, contact.Email, contact.Phone);
        });

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            deleteContact(contact.ID);
        });

        row.lastElementChild.appendChild(updateBtn);
        row.lastElementChild.appendChild(deleteBtn);

        tbody.appendChild(row);
    });
}

function renderPagination() {
    const paginationDiv = document.getElementById("pagination");
    if (!paginationDiv){
		console.log("Pagination div not found!");
		return;
	}

	console.log("Rendering pagination... allContacts.length =", allContacts.length);
    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(allContacts.length / contactsPerPage);
    console.log("Total pages calculated:", totalPages, "Current page:", currentPage); // debug
	
	if (totalPages <= 1) {
		console.log("Only one page, skipping pagination buttons");
		return;
	}

    // Previous
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => goToPage(currentPage - 1);
    paginationDiv.appendChild(prevBtn);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        if (i === currentPage) {
            pageBtn.disabled = true;
            pageBtn.classList.add("active-page");
        }
        pageBtn.onclick = () => goToPage(i);
        paginationDiv.appendChild(pageBtn);
    }

    // Next
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => goToPage(currentPage + 1);
    paginationDiv.appendChild(nextBtn);

	console.log("Pagination buttons rendered");
}

function goToPage(page) {
    currentPage = page;
    displayContacts();
    renderPagination();
}

function searchContacts() {
    let searchText = document.getElementById("searchText").value.trim();

    let tmp = { search: searchText, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                console.log("Search results:", xhr.responseText);
                let jsonObject = JSON.parse(xhr.responseText);

                let tbody = document.getElementById("tbody");
                tbody.innerHTML = "";

                if (jsonObject.results && jsonObject.results.length > 0) {
                    jsonObject.results.forEach(contact => {
                        let row = document.createElement("tr");

                        row.innerHTML = `
                            <td>${contact.FirstName}</td>
                            <td>${contact.LastName}</td>
                            <td>${contact.Email}</td>
                            <td>${contact.Phone}</td>
                            <td>
                                <button onclick="deleteContact(${contact.ID})">Delete</button>
                            </td>
                        `;

                        tbody.appendChild(row);
                    });
                } else {
                    let row = document.createElement("tr");
                    row.innerHTML = `<td colspan="5" style="text-align:center;">No contacts found</td>`;
                    tbody.appendChild(row);
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err) {
        console.log("Error:", err.message);
    }
}

function updateContact(contactId, firstName, lastName, email, phone) {
  // Pre-fill the add form with existing contact info
  document.getElementById("contactTextFirst").value = firstName;
  document.getElementById("contactTextLast").value = lastName;
  document.getElementById("contactTextEmail").value = email;
  document.getElementById("contactTextNumber").value = phone;

  // Show the form if it's hidden
  document.getElementById("addContactSection").hidden = false;

  // Change the Add button to an Update button temporarily
  const addBtn = document.querySelector("#addMe .buttons");
  addBtn.textContent = "Update Contact";
  addBtn.onclick = function() {
    saveUpdatedContact(contactId);
  };
}

function saveUpdatedContact(contactId) {
  let firstName = document.getElementById("contactTextFirst").value;
  let lastName = document.getElementById("contactTextLast").value;
  let email = document.getElementById("contactTextEmail").value;
  let phone = document.getElementById("contactTextNumber").value;

    let tmp = { 
    id: contactId, 
    firstName: firstName, 
    lastName: lastName, 
    email: email, 
    phone: phone, 
    userId: userId 
  };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/Update_Contact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        console.log("Update response:", xhr.responseText);
        alert("Contact updated!");
        loadContacts();

        // Reset form
        document.getElementById("addMe").reset();
        document.getElementById("addContactSection").hidden = true;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.error("Update error:", err.message);
  }
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

// This is for the footer in Contact-app.html
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".footer-toggle").forEach(btn => {
      const box = btn.closest(".footer").querySelector(".team-members");
      if (!box) return;
      // start collapsed
      btn.setAttribute("aria-expanded", "false");
      box.classList.remove("open");

      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") !== "true";
        btn.setAttribute("aria-expanded", String(open));
        box.classList.toggle("open", open);
      });
    });
  });

// Add contact form
function toggleAddForm() {
	const sec = document.getElementById("addContactSection");
	if (!sec) return;
	sec.hidden = !sec.hidden;
  }
  if (typeof showTable !== "function") {
	window.showTable = toggleAddForm;
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("contacts")) {
        readCookie(); // make sure userId is restored
        if (userId > 0) {
            loadContacts(); // fetch and show contacts immediately
        }
    }
});
