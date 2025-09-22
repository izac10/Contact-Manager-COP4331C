<?php  
	$inData = getRequestInfo(); //retrieve first name, last name, login, and password
	
	$firstName = $inData["firstName"];	
	$lastName = $inData["lastName"];	
	$login = $inData["login"];		
	$password = $inData["password"];	
	
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		//check if any field is empty
		if($firstName === "")
		{
			returnWithError("Missing First Name");
		}
		if($lastName === "")
		{
			returnWithError("Missing Last Name");
		}
		if($login === "")
		{
			returnWithError("Missing Login");
		}
		if($password === "")
		{
			returnWithError("Missing Password");
		}
		else{
			//insert into user
			$sql = "insert into Users (firstName,lastName, login, password) VALUES ('" . $firstName . "','" . $lastName . "','".$login."','".$password."')";
			if( $result = $conn->query($sql) != TRUE )
			{
				returnWithError( $conn->error );
			}
			else{
				returnWithError("");
			}
		}
		$conn->close();
	}	
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
