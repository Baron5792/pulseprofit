<?php
    require "../../component/required.php";

    require "../../config/database.php";

    try {
        $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN'] : null;
        $session_token = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token'] : null;
        
        if (!$received_token || !$session_token || $received_token !== $session_token) {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
        }

        if (isset($_SESSION['user'])) {
            unset($_SESSION['user']);
            session_destroy();

            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Logout successful']);
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }