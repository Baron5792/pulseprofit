<?php
    require "../component/required.php";
    require "../config/database.php";

    // validate captcha
    $captcha_question = isset($_SESSION['captcha_answer']) ? $_SESSION['captcha_answer'] : null;

    if ($captcha_question === null) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Captcha answer is required']);
        exit;
    }

    // fetch submitted data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $fullname = $data['fullname'] ?? null;
    $email = $data['email'] ?? null;
    $subject = $data['subject'] ?? null;
    $message = $data['message'] ?? null;
    $captcha_answer = $data['captcha'] ?? null;

    if ($data === null || !isset($data)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
        exit;
    }

    if ($captcha_answer != $captcha_question) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Incorrect captcha answer']);
    }

    // check if null
    else if (empty($fullname) || empty($email) || empty($subject) || empty($message) || empty($captcha_answer)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'All fields are required to proceed']);
    }

    else {
        try {
            // save fata
            $initial_status = 'PENDING';
            $stmt = $connection->prepare("INSERT INTO contact_us (fullname, email, subject, message, status) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $fullname, $email, $subject, $message, $initial_status);
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(['status' => 'success', 'message' => 'Your message has been sent successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Failed to send message, please try again later']);
            }
        }

        catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'An error has occured, please try again later']);
        }
    }
