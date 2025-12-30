<?php
    require "../../component/required.php";
    require "../../config/database.php";

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    try {
        $userId = $_SESSION['user']['id'];
        $file_content = file_get_contents('php://input');
        $decode_file = json_decode($file_content, true);
        $reference = $decode_file['reference'] ?? null;

        if (!$reference || $reference === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        // check if reference exist
        $check = $connection->prepare("SELECT reference_id FROM initial_transfer_track WHERE reference_id = ?");
        $check->bind_param('s', $reference);
        if ($check->execute()) {
            $result = $check->get_result();
            if ($result->num_rows > 0) {
                // delete reference track
                $delete = $connection->prepare("DELETE FROM initial_transfer_track WHERE reference_id = ? AND userId = ?");
                $delete->bind_param('si', $reference, $userId);
                if ($delete->execute()) {
                    http_response_code(200);
                    echo json_encode(['status' => 'success', 'message' => 'Transaction has been successfully terminated']);
                }

                else {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'An error occured while termination your transaction']);
                }
            }

            else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'An error occured']);
                exit;
            }
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'messsage' => 'An error occured']);
            exit;
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }