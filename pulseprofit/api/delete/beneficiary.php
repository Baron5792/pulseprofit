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

        $regId = $decode_file['regId'] ?? null; // Id of the table

        if (!$regId || $regId === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        // check if the beneficiary actually exist
        $confirm = $connection->prepare("SELECT beneficiaryId FROM beneficiary WHERE id = ?");
        $confirm->bind_param('i', $regId);
        if ($confirm->execute()) {
            $result = $confirm->get_result();
            if ($result->num_rows > 0) {
                // delete 
                $delete = $connection->prepare("DELETE FROM beneficiary WHERE userId = ? AND id = ?");
                $delete->bind_param('ii', $userId, $regId);
                if ($delete->execute()) {
                    http_response_code(200);
                    echo json_encode(['status' => 'success', 'message' => 'success']);
                }

                else {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Server responded with status 400']);
                }
            }

            else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Beneficiary not found']);
            }
        }

        else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Something went wrong']);
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }