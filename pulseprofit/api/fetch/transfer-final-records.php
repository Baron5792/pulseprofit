<?php
    require "../../component/required.php";
    require "../../config/database.php";

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired.']);
        exit;
    }

    try {
        $reference = isset($_GET['reference']) ? $_GET['reference'] : null;
        $userId = $_SESSION['user']['id'];

        if (!$reference || $reference === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        $status = 'PENDING';
        $query = $connection->prepare("SELECT userId, recipient_reg, txn_id, reference_id, amount FROM initial_transfer_track WHERE userId = ? AND reference_id = ? AND status = ?");
        $query->bind_param('iss', $userId, $reference, $status);
        if ($query->execute()) {
            $queryResult = $query->get_result();
            if ($queryResult->num_rows > 0) {
                $queryData = $queryResult->fetch_assoc();
                $recipient_reg = $queryData['recipient_reg'];
                $amount = $queryData['amount'];
                // fetch recipient's fullname, avatar
                $userQuery = $connection->prepare("SELECT avatar, fullname FROM users WHERE reg_id = ?");
                $userQuery->bind_param('s', $recipient_reg);
                if ($userQuery->execute()) {
                    $usersResult = $userQuery->get_result()->fetch_assoc();
                    $fullname = $usersResult['fullname'];
                    $avatar = $usersResult['avatar'];

                    $data = [
                        'fullname' => $fullname,
                        'avatar' => $avatar,
                        'recipient_reg' => $recipient_reg,
                        'reference' => $reference,
                        'amount' => $amount
                    ];

                    http_response_code(200);
                    echo json_encode(['status' => 'success', 'message' => 'Success', 'data' => $data]);
                }

                else {
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'An error occured while fetching users data']);
                }
            }

            else {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'An error occured while retrievig your data']);
            }
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'An error occured while processing data']);
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }