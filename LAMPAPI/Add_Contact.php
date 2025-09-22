<?php
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	
	function getRequestInfo()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        return array_change_key_case($data, CASE_LOWER);
    }

	$inData = getRequestInfo();

	error_log("Decoded data: " . print_r($inData, true));

	$firstName = $inData['firstname'] ?? '';
	$lastName  = $inData['lastname'] ?? '';
	$email     = $inData['email'] ?? '';
	$phone     = $inData['phone'] ?? '';
	$userId    = $inData['userid'] ?? null;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		if ($firstName === "") {
            returnWithError("Missing First Name");
        }
        if ($lastName === "") {
            returnWithError("Missing Last Name");
        }
        if ($Phone === "") {
            returnWithError("Empty or missing fields");
        }
        if ($Email === "") {
            returnWithError("Missing Email");
        }
        if ($UserID == 0) {
            returnWithError("Missing UserID");
        }
		else
		{
			$sql = "INSERT INTO Contacts (UserID, FirstName, LastName, Email, Phone) VALUES (?, ?, ?, ?, ?)";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param("issss", $userId, $firstName, $lastName, $email, $phone);

			if(!$stmt->execute())
			{
				returnWithError($stmt->error);
			}
			else
			{
				returnWithInfo("Contact added successfully");
			}

			$stmt->close();
		}

		$conn->close();
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

	function returnWithInfo( $msg )
	{
		$retValue = '{"success":"' . $msg . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
