<?php
    require "../../component/required.php";
    require "../../config/database.php";

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please try again later']);
        exit;
    }

    try {
        $userId = $_SESSION['user']['id'];
        $referenceId = isset($_GET['reference']) ? $_GET['reference']: null;

        if (!$referenceId || $referenceId === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        

        // fetch for where the data exist
        $fetch = $connection->prepare("SELECT userId, recipient_reg, txn_id, reference_id FROM initial_transfer_track WHERE userId = ? AND reference_id = ?");
        $fetch->bind_param('is', $userId, $referenceId);
        if ($fetch->execute()) {
            $result = $fetch->get_result();
            if ($result->num_rows > 0) {
                // fetch user's name with the given Reg Id
                $data = $result->fetch_assoc();
                $regId = $data['recipient_reg'];
                $txn_id = $data['txn_id'];
                // query for data
                $query = $connection->prepare('SELECT fullname, balance FROM users WHERE reg_id = ?');
                $query->bind_param('i', $regId);
                $query->execute();
                $userResult = $query->get_result();
                if ($userResult->num_rows > 0) {
                    $userData = $userResult->fetch_assoc();
                    $fullname = $userData['fullname'] ?? null;
                    $balance = $userData['balance'];

                    // fetch senders balance
                    $requestData = $connection->prepare("SELECT balance FROM users WHERE id = ?");
                    $requestData->bind_param('i', $userId);
                    $requestData->execute();
                    $sendersData = $requestData->get_result()->fetch_assoc();
                    $sendersBalance = $sendersData['balance'] ?? null;

                    // send back to the react   
                    $response = [
                        'fullname' => $fullname,
                        'reference' => $referenceId,
                        'reg_id' => $regId,
                        'txn_id' => $txn_id,
                        'balance' => $sendersBalance
                    ];

                    http_response_code(200);
                    echo json_encode(['status' => 'success', 'message' => 'Fetched successfully', 'data' => $response]);
                }

                else {
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'An error occured while retrieving data']);
                }
            }

            else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Request not found or concluded']);
                exit;
            }
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Request not found or concluded']);
            exit;
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }