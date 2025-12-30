<?php
    require "../../component/required.php";

    require "../../config/database.php";

    // validate csrf token
    $session_token = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token']: null;
    $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN']: null;
    const UPLOAD_DIR = '../../images/kyc/';

    if (!$session_token || !$received_token || $received_token !== $session_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired, please reload the page and try again']);
        exit;
    }

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired, plaese reload and try again']);
        exit;
    }

    try {
        $userId = $_SESSION['user']['id'];
        $avatar = $_FILES['image'];

        // check if the last uploaded is pending
        $confirm = $connection->prepare("SELECT status FROM kyc_verification WHERE userId= ? ORDER BY date DESC LIMIT 1");
        $confirm->bind_param('i', $userId);
        $confirm->execute();
        $result = $confirm->get_result();
        if ($result->num_rows > 0) {
            $last_data = $result->fetch_assoc();
            $last_status = $last_data['status'];
            if ($last_status === 'PENDING') {
                http_response_code(409);
                echo json_encode(['status' => 'error', 'message' => 'Your previous KYC verification still awaits approval']);
                exit;
            }
        }

        $time = time();
        $avatar_name = $time . $avatar['name'];
        $tmp_name = $avatar['tmp_name'];
        $allowed_files = ['png', 'jpg', 'jpeg', 'pdf', 'bmp'];
        $extension = explode('.', $avatar_name);
        $extension = end($extension);
        $directory = UPLOAD_DIR . $avatar_name;
        if (!in_array($extension, $allowed_files)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'File format not supported. Please use a JPG, PNG, JPEG, or PDF file']);
            exit;
        }

        if ($avatar['size'] > 10000000) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'File size should not exceed 10MB']);
            exit;
        }

        if (move_uploaded_file($tmp_name, $directory)) {
            $status = 'PENDING';
            $stmt = $connection->prepare("INSERT INTO kyc_verification (userId, image, status) VALUES (?, ?, ?)");
            $stmt->bind_param('iss', $userId, $avatar_name, $status);
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(['status' => 'success', 'message' => 'our identity documents have been successfully submitted for verification. Your KYC application is now Awaiting Approval. We will notify you via email as soon as the review is complete and your account is fully verified.']);
            }

            else {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'An error occured while uploading the file. Please try again later']);
            }
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => '']);
    }

