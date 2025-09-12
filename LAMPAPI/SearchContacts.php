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
        //first and last name
        $sql = "SELECT firstName, lastName, Email, Phone, ID 
                FROM Contacts 
                WHERE (firstName LIKE '%" . $inData["search"] . "%' 
                    OR lastName LIKE '%" . $inData["search"] . "%')
                AND UserID=" . $inData["userId"];

        $result = $conn->query($sql);

        if ($result->num_rows > 0)
        {
            while($row = $result->fetch_assoc())
            {
                $searchResults[] = array(
                    "FirstName" => $row["firstName"],
                    "LastName"  => $row["lastName"],
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