<?php

    $inData = getRequestInfo();
    
    $searchResults = array();

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        $search = "%" . $inData["search"] . "%";
        $userId = intval($inData["userId"]);

        $stmt = $conn->prepare("
            SELECT FirstName, LastName, Email, Phone, ID
            FROM Contacts
            WHERE (FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR Phone LIKE ?)
            AND UserID = ?
        ");

        $stmt->bind_param("ssssi", $search, $search, $search, $search, $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0)
        {
            while($row = $result->fetch_assoc())
            {
                $searchResults[] = array(
                    "FirstName" => $row["FirstName"], // uppercase F
                    "LastName"  => $row["LastName"],  // uppercase L
                    "Email"     => $row["Email"],
                    "Phone"     => $row["Phone"],
                    "ID"        => $row["ID"]
                );
            }
            returnWithInfo($searchResults);
        }
        else
        {
            returnWithError("No Records Found");
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
        $retValue = array("results" => [], "error" => $err);
        sendResultInfoAsJson(json_encode($retValue));
    }
    
    function returnWithInfo($searchResults)
    {
        $retValue = array("results" => $searchResults, "error" => "");
        sendResultInfoAsJson(json_encode($retValue));
    }
    
?>