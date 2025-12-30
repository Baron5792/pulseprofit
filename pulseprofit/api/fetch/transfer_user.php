<?php
    include "../../component/required.php";

    include "../../config/database.php";

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please try again later']);
        exit;
    }

    // validate csrf token
    $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN']: null;
    $session_token = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token']: null;

    if (!$received_token || !$session_token || $received_token !== $session_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
        exit;
    }

    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        if (!$data || $data === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        $account_number = filter_var($data['account_number'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $userId = $_SESSION['user']['id'];

        if (strlen($account_number) < 1) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'An account number is required']);
            exit;
        }

        if (!is_numeric($account_number)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Values must be a NUMBER']);
            exit;
        }

        // query for the users data
        $query = $connection->prepare("SELECT id, reg_id, fullname, username, email, avatar FROM users WHERE reg_id = ?");
        $query->bind_param('i', $account_number);
        if ($query->execute()) {
            $result = $query->get_result();

            if ($result->num_rows > 0) {    
                $details = $result->fetch_assoc();            
                if ($userId === $details['id']) {
                    http_response_code(403);
                    echo json_encode(['status' => 'error', 'message' => 'Access denied to perform this action']);
                    exit;
                }

                $user = [
                    'id' => $details['id'] ?? null,
                    'reg_id' => $details['reg_id'] ?? null,
                    'fullname' => $details['fullname'] ?? null,
                    'email' => $details['email'] ?? null,
                    'avatar' => $details['avatar'] ?? null,
                    'username' => $details['username'] ?? null
                ];

                http_response_code(200);
                echo json_encode(['status' => 'success', 'data' => $user]);
            }

            else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'No user found with this account']);
            }
        }

        else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'An error occured while fetching users data']);
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }