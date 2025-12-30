<?php
    ob_start();
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    require "../../component/required.php";
    require '../../config/database.php';

    // check for csrf token
    // $session_token =  isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token'] : null;
    // $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN'] : null;
    // if (!$received_token || !$session_token || $session_token !== $received_token) {
    //     http_response_code(403);
    //     echo json_encode(['status' => 'error', 'message' => "Your session has expired. Please refresh the page and try again"]);
    //     exit;
    // }

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (empty($data) || !isset($data)) {
        ob_end_clean();
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
        exit;
    }

    $email = strtolower(trim($data['email'] ?? ''));
    $password = $data['password'] ?? null;

    try {
        if (empty($email) || empty($password)) {
            ob_end_clean();
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'All fields are required to proceed']);
            exit;
        }

        // check if email exist
        $userData = [];
        $confirmEmail = $connection->prepare("SELECT id, password FROM users WHERE email= ?");
        $confirmEmail->bind_param('s', $email);
        $confirmEmail->execute();
        $emailResult = $confirmEmail->get_result();
        if ($emailResult->num_rows > 0) {
            $details = $emailResult->fetch_assoc(); // every users data
            // confirm password
            $databasePassword = $details['password'];
            if (password_verify($password, $databasePassword)) {
                $_SESSION['user'] = $details;
                ob_end_clean();
                http_response_code(200);
                echo json_encode(['status' => 'success', 'message' => 'Login successful']);
                exit;
            }

            else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Invalid email address or password']);      
                exit;
            }
        }

        else {
            ob_end_clean();
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Invalid email address or password']);
            exit;
        }
    }

    catch (Exception $e) {
        ob_end_clean();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
        exit;
    }
