<?php
	$inData = getRequestInfo();
	
	//retrieving firstName, LastName, userId, email, phone
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$userId = $inData["userId"]; 

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		if($firstName === "" || $lastName === "" || $email === "" || $phone === ""){
			returnWithError("Empty fields");
		}
		else{
			$sql = "insert into Contacts (UserId,FirstName, LastName, Email, Phone) VALUES (" . $userId . ",'" . $firstName . "', '".$lastName."', '".$email."', '".$phone."')";
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