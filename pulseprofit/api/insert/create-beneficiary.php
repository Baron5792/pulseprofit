<?php
    require "../../component/required.php";
    require "../../config/database.php";

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    try {
        $file_content = file_get_contents('php://input');
        $decode_file = json_decode($file_content, true);

        $reference = $decode_file['referenceId'] ?? null;
        $newState = $decode_file['newState'] ?? null;
        $userId = $_SESSION['user']['id'];

        if (!$reference || $newState === null || !is_bool($newState)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        // first generate the beneficiary ID
        $fetch = $connection->prepare("SELECT recipient_reg FROM initial_transfer_track WHERE reference_id = ? AND userId = ?");
        $fetch->bind_param('si', $reference, $userId);
        if ($fetch->execute()) {
            $result = $fetch->get_result()->fetch_assoc();
            $benefiaryReg = $result['recipient_reg'];

            // query for beneficiaries userId
            $query = $connection->prepare("SELECT id FROM users WHERE reg_id = ?");
            $query->bind_param('i', $benefiaryReg);
            if ($query->execute()) {
                $beneficiaryResult = $query->get_result()->fetch_assoc();
                $beneficiaryId = $beneficiaryResult['id'];

                // /check the toggle process
                if ($newState === true) {
                    // check if beneficiary exist already
                    $confirm = $connection->prepare("SELECT beneficiaryId FROM beneficiary WHERE beneficiaryId = ?");
                    $confirm->bind_param('i', $beneficiaryId);
                    if ($confirm->execute()) {
                        $beneficiaryResult = $confirm->get_result();
                        if ($beneficiaryResult->num_rows > 0) {
                            http_response_code(400);
                            echo json_encode(['status' => 'error', 'message' => 'Beneficiary already exist']);
                            exit;
                        }

                        else {
                            // create a new one
                            $create = $connection->prepare("INSERT INTO beneficiary (userId, beneficiaryId) VALUES (?, ?)");
                            $create->bind_param('ii', $userId, $beneficiaryId);
                            if ($create->execute()) {
                                http_response_code(200);
                                echo json_encode(['status' => 'success', 'message' => 'Beneficiary added successfully']);
                            }

                            else {
                                http_response_code(400);
                                echo json_encode(['status' => 'error', 'message' => 'An error occured while processing your request']);
                            }
                        }
                    }

                    else {
                        http_response_code(404);
                        echo json_encode(['status' => 'error', 'message' => 'An error occured while preparing your request']);
                    }
                }

                else {
                    // remove beneficiary
                    // check if beneficiary exist first
                    $confirm = $connection->prepare("SELECT beneficiaryId FROM beneficiary WHERE beneficiaryId = ? AND userId = ?");
                    $confirm->bind_param('ii', $beneficiaryId, $userId);
                    if ($confirm->execute()) {
                        $beneficiaryResult = $confirm->get_result();
                        if ($beneficiaryResult->num_rows > 0) {
                            $delete = $connection->prepare("DELETE FROM beneficiary WHERE beneficiaryId = ? AND userId = ?");
                            $delete->bind_param('ii', $beneficiaryId, $userId);
                            if ($delete->execute()) {
                                http_response_code(200);
                                echo json_encode(['status' => 'success', 'message' => 'Beneficiary removed successfully']);
                            }

                            else {
                                http_response_code(500);
                                echo json_encode(['status' => 'error', 'message' => 'Server responded with status 500']);
                            }
                        }

                        else {
                            http_response_code(400);
                            echo json_encode(['status' => 'error', 'message' => 'Beneficiary does not exist']);
                            exit;
                        }
                    }

                    else {
                        http_response_code(404);
                        echo json_encode(['status' => 'error', 'message' => 'An error occured while preparing your request']);
                    }
                }
            }

            else {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'An error occured during the process. Please try again later']);
            }
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Server responded with status 400']);
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }