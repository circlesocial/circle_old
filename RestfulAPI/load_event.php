<?php
    //http://stackoverflow.com/questions/18382740/cors-not-working-php
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }

    fetch_events();

    function fetch_events() {
        $servername = "localhost";
        $username = "root";
        $db_password = "circle123456!";
        $dbname = "Circle";

        // Create connection
        $conn = new mysqli($servername, $username, $db_password, $dbname);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        } 

        $sql = "SELECT * FROM events";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $json_arr = array();
            // output data of each row
            while($row = $result->fetch_assoc()) {
                $event = array("image_name" => $row["id"], 
                "event_name" => $row["title"], 
                "description" => $row["description"], 
                "start_time" => $row["start"], 
                "address" => $row["location"], 
                "price" => $row["price"]);
                array_push($json_arr, $event);
            }
            $json_res = json_encode($json_arr);
            //set header
            header('Content-type: application/json');
            echo $json_res;
        } else {
            echo "0 results";
        }
        $conn->close();
    }

?>