<?php
    $inData = getRequestInfo();

    $id = $inData["id"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phone = $inData["phone"];
    $userId = $inData["userId"];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        returnWithError("Invalid email format");
    }

    if (!preg_match('/^\d{10}$/', $phone)) {
        returnWithError("Phone number must be exactly 10 digits");
    }


    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else 
    {
        $stmt = $conn->prepare("UPDATE Contacts SET firstName=?, lastName=?, email=?, phone=? WHERE ID=? AND userId=?");
        $stmt->bind_param("ssssii", $firstName, $lastName, $email, $phone, $id, $userId);

        if ($stmt->execute()) 
        {
            if ($stmt->affected_rows > 0) {
                returnWithInfo("Contact updated successfully");
            } else {
                returnWithError("No matching contact found or nothing to update");
            }
        } 
        else 
        {
            returnWithError($stmt->error);
        }

        $stmt->close();
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

    function returnWithInfo($msg)
    {
        $retValue = '{"message":"' . $msg . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>