<?php  
<<<<<<< HEAD
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
=======
    $inData = getRequestInfo(); //retrieve first name, last name, login, and password
    
    $firstName = $inData["firstName"];    
    $lastName = $inData["lastName"];    
    $login = $inData["login"];        
    $password = $inData["password"];    
    
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        // check if any field is empty
        if($firstName === "" || $lastName === "" || $login === "" || $password === "")
        {
            returnWithError("All fields are required.");
            $conn->close();
            exit;
        }

        // password validation: at least 8 chars, 1 uppercase, 1 number
        if(!preg_match('/^(?=.*[A-Z])(?=.*\d).{8,}$/', $password)) 
        {
            returnWithError("Password must be at least 8 characters, include 1 uppercase letter and 1 number.");
            $conn->close();
            exit;
        }

        // duplicate username check
        $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
        $stmt->bind_param("s", $login);
        $stmt->execute();
        $stmt->store_result();
        if($stmt->num_rows > 0) 
        {
            returnWithError("That username is already taken.");
            $stmt->close();
            $conn->close();
            exit;
        }
        $stmt->close();

        // insert into user
        $sql = "INSERT INTO Users (FirstName, LastName, Login, Password) VALUES ('" . $firstName . "','" . $lastName . "','" . $login . "','" . $password . "')";
        if($conn->query($sql) != TRUE)
        {
            returnWithError($conn->error);
        }
        else
        {
            returnWithError(""); // success
        }

        $conn->close();
    }    
    
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }
    
    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>
>>>>>>> 80b35948ab5f4f394090a2072488982b140f3178
