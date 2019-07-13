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
        $password = $request->password;
        send_response(init_account($username, $password));
    } else {
        send_response("Error");
    }

    function init_account($email, $password) {
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
                return "Error";
            } else { // account exists but hasn't been verified
                // send a new verification code as email
                $verification_code = generate_random_code();
                $update_code = "UPDATE User_account_registration SET password='".$password."', verificationCode='".$verification_code."' WHERE email='".$email."'";
                $conn->query($update_code);
                $conn->close();
                send_activation_email($verification_code, $email);
                return "Success";
            }
        } else {
            $verification_code = generate_random_code();

            $sql = "INSERT INTO User_account_registration (email, password, verificationCode)
            VALUES ('".$email."', '".$password."', '".$verification_code."')";

            if ($conn->query($sql) === TRUE) {
                send_activation_email($verification_code, $email);
                $conn->close();
                return "Success";
            } else {
                $conn->close();
                return "Error";
            }
        }
        
    }

    function generate_random_code() {
        return sprintf("%06d", mt_rand(1, 999999));
    }

    function send_activation_email($verification_code, $email) {
         $to = $email;
         $subject = "Circle-Verify Your Email";
         
         $message = "Hi!<br><br> Your verification code is ".$verification_code.". Please use it to activate your account. <br><br> Thank you.<br> Circle Customer Service";
         
         $header = "From:tonifglobe@gmail.com \r\n";
         $header .= "MIME-Version: 1.0\r\n";
         $header .= "Content-type: text/html\r\n";
         
         $retval = mail($to,$subject,$message,$header);
         
        //  if($retval == true) {
        //     echo "Message sent successfully...";
        //  }else {
        //     echo "Message could not be sent...";
        //  }
    }

    function send_response($message) {
        $data = ['result' => $message];
        header('Content-Type: application/json');
        echo json_encode($data);
    }
?>