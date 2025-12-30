<?php
    require "../../component/required.php";

    require "../../config/database.php";

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please refresh to continue']);
        exit;
    }

    try {
        $userId = $_SESSION['user']['id'];
        // fetch last kyc verification
        $stmt = $connection->prepare("SELECT status FROM kyc_verification WHERE userId= ? ORDER BY date DESC LIMIT 1");
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $assoc = $result->fetch_assoc();
        $status = $assoc['status'] ?? "NOT_SUBMITTED";

        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => $status]);
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }