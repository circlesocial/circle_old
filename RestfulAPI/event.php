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


    //http://stackoverflow.com/questions/15485354/angular-http-post-to-php-and-undefined
    $postdata = file_get_contents("php://input");
    if (isset($postdata)) {
        $request = json_decode($postdata);
        $image_name = $request->image_name;
        $event_name = $request->event_name;
        $description = $request->description;
        $tags = $request->tags;
        $start = $request->start;
        $end = $request->end;
        $location = $request->location;
        $price = $request->price;
        send_response(insert_event($image_name, $event_name, $description, $tags, $start, $end, $location, $price));
    } else {
        send_response("Failure");
    }

    function insert_event($image_name, $event_name, $description, $tags, $start, $end, $location, $price) {
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

        $insert_sql = "INSERT INTO events (id, title, description, categories, start, end, location, price) VALUES ('".$image_name."', '".$event_name.
        "', '".$description."', '".$tags."', '".$start."', '".$end."', '".$location."', '".$price."')";
        if ($conn->query($insert_sql) === TRUE) {
            $conn->close(); 
            return "Success";
        } else {
            $conn->close(); 
            return "Failure";
        }
    }
    
    function send_response($message) {
        $data = ['result' => $message];
        header('Content-Type: application/json');
        echo json_encode($data);
    }

?>