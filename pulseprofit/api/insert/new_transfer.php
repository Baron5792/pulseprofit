<?php
    require "../../component/required.php";
    require "../../config/database.php";

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    // validate csrf token
    $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN']: null;
    $session_token = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token']: null;

    if (!$received_token || !$session_token || $session_token !== $received_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please try again later']);
        exit;
    }

    $connection->begin_transaction();
    try {
        $file_content = file_get_contents('php://input');
        $decode_file = json_decode($file_content, true);

        if (!$decode_file || $decode_file === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        $reference = $decode_file['reference'] ?? null;
        $userId = $_SESSION['user']['id'];

        if (!$reference) {  
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data received']);
            exit;
        }

        // check if the reference exist and fetch all data
        $status = 'PENDING';
        $confirm = $connection->prepare("SELECT userId, recipient_reg, txn_id, reference_id, amount, status FROM initial_transfer_track WHERE userId = ? AND reference_id = ?");
        $confirm->bind_param('is', $userId, $reference);
        if ($confirm->execute()) {
            $confirmResult = $confirm->get_result();
            if ($confirmResult->num_rows > 0) {
                // fetch all track records
                $trackData = $confirmResult->fetch_assoc();
                $receiever_reg = $trackData['recipient_reg'];
                $txn_id = $trackData['txn_id'];
                $amount = $trackData['amount'];
                
                // update the track
                $completed_status = 'COMPLETED';
                $update = $connection->prepare("UPDATE initial_transfer_track SET status = ? WHERE status = ? AND reference_id = ? AND userId = ?");
                $update->bind_param('sssi', $completed_status, $status, $reference, $userId);
                if ($update->execute()) {

                    // fetch receivers email and userId and update balance
                    $ReceiverDetails = $connection->prepare('SELECT email, id FROM users WHERE reg_id = ?');
                    $ReceiverDetails->bind_param('i', $receiever_reg);
                    if ($ReceiverDetails->execute()) {
                        $receiverData = $ReceiverDetails->get_result()->fetch_assoc();
                        $receiverEmail = $receiverData['email'];
                        $receiverId = $receiverData['id'];

                        // update the recivers track with the transfer amount
                        $updateReceiver = $connection->prepare("UPDATE users SET balance = balance + ? WHERE reg_id = ?");
                        $updateReceiver->bind_param('di', $amount, $receiever_reg);
                        if ($updateReceiver->execute()) {

                            // debit the sender's balance
                            $debitSender = $connection->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
                            $debitSender->bind_param('di', $amount, $userId);
                            if ($debitSender->execute()) {
                                // update the receivers transation history
                                $receiverTitle = 'Incoming Transfer';
                                $wallet_name = 'Primary Wallet';

                                $receiverTransaction = $connection->prepare("INSERT INTO transactions (userId, title, reference_id, txn_id, amount, status, wallet_name, sender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                                $receiverTransaction->bind_param('isssdsss', $receiverId, $receiverTitle, $reference, $txn_id, $amount, $completed_status, $wallet_name, $_SESSION['user']['fullname']);
                                if ($receiverTransaction->execute()) {

                                    // update the senders transaction history
                                    $senderTitle = 'Outgoing Transfer';
                                    $senderTransaction = $connection->prepare("INSERT INTO transactions (userId, title, reference_id, txn_id, amount, status, wallet_name) VALUES (?, ?, ?, ?, ?, ?, ?)");
                                    $senderTransaction->bind_param('isssdss', $userId, $senderTitle, $reference, $txn_id, $amount, $completed_status, $wallet_name);
                                    if ($senderTransaction->execute()) {
                                        // send email
                                        $connection->commit();
                                        http_response_code(201);
                                        echo json_encode(['status' => 'success', 'message' => 'Transfer has been made successfully']);
                                    }

                                    else {
                                        $connection->rollback();
                                        http_response_code(400);
                                        echo json_encode(['status' => 'error', 'message' => 'Something went wrong']);
                                    }
                                }

                                else {
                                    $connection->rollback();
                                    http_response_code(400);
                                    echo json_encode(['status' => 'error', 'message' => 'Something went wrong']);
                                }
                            }

                            else {
                                $connection->rollback();
                                http_response_code(400);
                                echo json_encode(['status' => 'error', 'message' => '']);
                            }

                        }

                        else {
                            $connection->rollback();
                            http_response_code(400);
                            echo json_encode(['status' => 'error', 'message' => 'Something went wrong, please try again later']);
                        }
                    }

                    else {
                        $connection->rollback();
                        http_response_code(404);
                        echo json_encode(['status' => 'error', 'message' => 'Recipient does not exist']);
                    }

                }

                else {
                    $connection->rollback();
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Something went wrong. Server responded with status: 400']);
                }
            }

            else {
                $connection->rollback();
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Something went wrong. STATUS 404']);
            }
        }

        else {
            $connection->rollback();
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Something went wrong']);
        }
    }

    catch (Exception $e) {
        $connection->rollback();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }