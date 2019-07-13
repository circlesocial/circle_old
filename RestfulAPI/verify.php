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
        $username = $request->email;
        $verifi_code = $request->verifi_code;
        send_response(verify_account($username, $verifi_code));
    } else {
        send_response("Failure");
    }

    function verify_account($email, $verifi_code) {
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

        $exist_sql = "SELECT * FROM User_account_registration WHERE email='".$email."'";
        $result = $conn->query($exist_sql);

        if ($result->num_rows > 0) { // account exists in database
            $row = $result->fetch_assoc();
            if ($row["active"] == 1) { // account exists and has been verified
                $conn->close(); 
                return "Success";
            } else { // account exists but hasn't been verified
                if ($row["verificationCode"] == $verifi_code) {
                    // set active to 1
                    $set_active_sql = "UPDATE User_account_registration SET active=1 WHERE email='".$email."'";
                    $conn->query($set_active_sql);
                    $conn->close(); 
                    return "Success";
                } else {
                    $conn->close(); 
                    return "Failure";
                }
            }
        } else { // account DNE
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