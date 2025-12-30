<?php
    ob_start();
    require "../../component/required.php";
    require "../../config/database.php";
    include "../../component/email.php";

    if (!isset($_SESSION['user'])) {
        die(json_encode(['Your session has expired please refresh and try again later']));
    }

    $received_token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    $session_token = $_SESSION['csrf_token'] ?? null;

    if (!$received_token || !$session_token || $session_token !== $received_token) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired please try again later']);
    }

    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        if (!$data || $data == null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        $userId = $_SESSION['user']['id'];
        $current_email = filter_var($data['current_email'] ?? '', FILTER_SANITIZE_EMAIL);
        $new_email = filter_var($data['new_email'] ?? '', FILTER_SANITIZE_EMAIL);
        $confirm_email = filter_var($data['confirm_email'] ?? '', FILTER_SANITIZE_EMAIL);

        function generateSixRandomNumbersEfficient(int $min, int $max): array {
            // Check if the range is large enough to pick 6 unique numbers
            if ($max - $min + 1 < 6) {
                // Handle error gracefully if the range is too small
                return [];
            }
            
            // Creates an array of all numbers in the range
            $fullRange = range($min, $max);
            
            // Randomly reorders the array in place
            shuffle($fullRange); 
            
            // Returns the first 6 elements
            return array_slice($fullRange, 0, 6); 
        }

        $otp_array = generateSixRandomNumbersEfficient(0, 9);
        $otp_code = implode('', $otp_array);

        if (empty($new_email) || empty($confirm_email)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'All fields are required to proceed']);
            exit;
        }

        if ($new_email !== $confirm_email) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'Email do not match']);
            exit;
        }

        // fetch users current email address
        $stmt = $connection->prepare("SELECT email FROM users WHERE id = ?");
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $current_result = $stmt->get_result();
        if ($current_result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'No email address was found for this user']);
            exit;
        }

        $current_info = $current_result->fetch_assoc();
        $current_email = $current_info['email'];


        // check if new email exist already in the database
        $verify = $connection->prepare("SELECT email FROM users WHERE email = ?");
        $verify->bind_param('s', $new_email);
        $verify->execute();
        $userResult = $verify->get_result();
        if ($userResult->num_rows > 0) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'Email has already been registered']);
            exit;
        }

        // update email change track
        $update = $connection->prepare("INSERT INTO change_email_track (userId, otp_code, new_email) VALUES (?, ?, ?)");
        $update->bind_param('iss', $userId, $otp_code, $new_email);
        if ($update->execute()) {
            // send email to the current email address
            $mail->addAddress($current_email);
            $mail->Subject = 'Email change on Pulse Profit';
            $mail->Body = '';
            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'An OTP has been sent to successfully']);
        }

        else {
            ob_end_clean();
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Something went wrong']);
        }
    }

    catch (Exception $e) {
        ob_end_clean();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }