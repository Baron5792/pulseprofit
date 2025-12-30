<?php
    require "../../component/required.php";

    require "../../config/database.php";

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // validate csrf token
    $session_token = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token']: null;
    $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN']: null;

    if (!$session_token || !$received_token || $session_token !== $received_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please refresh the page and try again']);
        exit;
    }

    if (!isset($data) || $data === null) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
        exit;
    }

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'User is not authenticated']);
        exit;
    }

    $userId = $_SESSION['user']['id'];

    try {
        // fetch inputs
        $fullname = filter_var($data['fullname'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $username = filter_var($data['username'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $phone = trim($data['phone']);
        $telegram = trim($data['telegram']) ?? null;
        $gender = filter_var($data['gender'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $date_of_birth = $data['date_of_birth'] ?? '';

        // check if empty
        if (empty($fullname) || empty($username) || empty($phone)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Every required field must not be empty']);
            exit;
        }

        if (!is_numeric($phone) || is_nan($phone)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Phone number must be numeric']);
            exit;
        }

        // check if username exist already
        $query = $connection->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
        $query->bind_param('si', $username, $userId);
        $query->execute();
        $queryResult = $query->get_result();
        if ($queryResult->num_rows > 0) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Username already taken, please try again']);
            exit;
        }

        // update user
        $stmt = $connection->prepare("UPDATE users SET fullname= ?, username= ?, phone= ?, telegram= ?, gender= ?, date_of_birth= ? WHERE id= ?");
        $stmt->bind_param('ssssssi', $fullname, $username, $phone, $telegram, $gender, $date_of_birth, $userId);
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Your personal profile has been successfully updated']);
        }

        else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'An error occured while updating your profile. Please check your network and try again']);
            exit;
        }

    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }