<?php
    require "../../component/required.php";
    require "../../config/database.php";

    $reference = isset($_GET['reference']) ? $_GET['reference']: null;

    if (!$reference || empty($reference)) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Access denied']);
        exit;
    }

    try {
        $check = $connection->prepare("SELECT id, email FROM reset_password WHERE reference_id = ? AND status = 'PENDING'");
        $check->bind_param('s', $reference);
        $check->execute();
        $result = $check->get_result();
        if ($result->num_rows > 0) {
            $data = $result->fetch_assoc();
            $email = $data['email'] ?? null;

            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Success', 'data' => $email]);
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Record does not exist']);
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }