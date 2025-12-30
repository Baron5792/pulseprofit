<?php
    include "../../component/required.php";

    include "../../config/database.php";

    $session_token = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token']: null;
    $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN']: null;

    if (!$session_token || !$received_token || $received_token !== $session_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please refresh the page and try again']);
        exit;
    }

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'User is not authenticated']);
        exit;
    }

    $userId = $_SESSION['user']['id'];

    // fetch data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!isset($data) || $data === null) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
        exit;
    }

    // validate inputs
    $address1 = $data['address1'] ?? '';
    $address2 = $data['address2'] ?? '';
    $city = $data['city'] ?? '';
    $state = $data['state'] ?? '';
    $zipcode = $data['zipcode'] ?? '';
    $country = $data['country'] ?? '';
    $nationality = $data['nationality'] ?? '';

    if (empty($address1) || empty($state) || empty($country)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Every required field must not be empty']);
        exit;
    }

    try {
        // update data
        $stmt = $connection->prepare("UPDATE users SET address1 = ?, address2 = ?, city = ?, state = ?, zipcode = ?, country= ?, nationality = ? WHERE id = ?");
        $stmt->bind_param('sssssssi', $address1, $address2, $city, $state, $zipcode, $country, $nationality, $userId);
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Your address has been uodated successfully']);
        }

        else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'An error occured while updating your profile. Please try again']);
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['state' => 'error', 'message' => 'Internal server error']);
    }




