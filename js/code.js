console.log("code.js loaded");
const urlBase = 'http://small-project-team6.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
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
	let firstName = document.getElementById("contactTextFirst").value.trim();
	let lastName = document.getElementById("contactTextLast").value.trim();
	let email = document.getElementById("contactTextEmail").value.trim();
	let phone = document.getElementById("contactTextNumber").value.trim();
  
	// Clear result area (we can add a <div id="contactAddResult"> later if needed)
	console.log("Adding contact:", firstName, lastName, email, phone);
  
	let tmp = {
	  FirstName: firstName,
	  LastName: lastName,
	  Email: email,
	  Phone: phone,
	  UserId: userId
	};
  
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
		  }
		}
	  };
	  xhr.send(jsonPayload);
	}
	catch(err) {
	  console.log("Error:", err.message);
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
  
  
  
