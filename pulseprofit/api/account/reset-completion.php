<?php   
    require "../../component/required.php";
    require "../../config/database.php";

    $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ?? null;
    $session_token = isset($_SESSION['csrf_token']) ?? null;

    if (!$received_token || !$session_token || $received_token !== $session_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please refresh the page and try again']);
        exit;
    }

    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        $new_password = $data['new_password'] ?? null;
        $verification_code = $data['verification_code'] ?? null;
        $reference = $data['reference'] ?? null;
        $email = $data['email'] ?? null;

        if (!$new_password || !$verification_code || !$reference || !$email) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'All fields are required to peoceed']);
            exit;
        }

        if (strlen($new_password) < 6) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Password length must exceed 6 characters']);
            exit;
        }

        // check if reference exist with this email
        $query = $connection->prepare("SELECT email, reference_id, verification_code FROM reset_password WHERE reference_id = ? AND email = ? AND verification_code = ?");
        $query->bind_param('ssi', $reference, $email, $verification_code);
        $query->execute();
        $result = $query->get_result();
        if ($result->num_rows > 0) {
            // hash password
            $hash = password_hash($new_password, PASSWORD_DEFAULT);
            // mark the reset row to be completed
            $mark = $connection->prepare("UPDATE reset_password SET status = 'COMPLETED' WHERE reference_id = ? AND email = ? AND verification_code = ?");
            $mark->bind_param('ssi', $reference, $email, $verification_code);
            if ($mark->execute()) {
                // update users password
                $stmt = $connection->prepare("UPDATE users SET password = ? WHERE email = ? LIMIT 1");
                $stmt->bind_param('ss', $hash, $email);
                if ($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode(['status' => 'success', 'message' => 'Password has been reset successfully']);
                }

                else {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'An error occured while updating your new password']);
                }
            }

            else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'An error occured while updating status']);
            }
        }

        else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid Verification Credentials']);
            exit;
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }