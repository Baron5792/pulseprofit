<?php
    ob_start();
    require "../../../component/required.php";
    require "../../../config/database.php";
    require "../../../component/email.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired please refresh the page and try again.']);
        exit;
    }

    $session_token = $_SESSION['csrf_token'] ?? null;
    $received_token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;

    if (!$received_token || !$session_token || $received_token !== $session_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired please refresh the page and try again.']);
        exit;
    }

    $connection->begin_transaction();
    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $reference_id = $data['reference_id'] ?? null;
        $userId = $data['userId'] ?? null;

        if (!$reference_id || empty($reference_id)) {
            ob_end_clean();
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        // update the users transaction history
        $status = 'COMPLETED';
        $updateTransaction = $connection->prepare("UPDATE transactions SET status = ? WHERE reference_id = ? AND userId = ?");
        $updateTransaction->bind_param('ssi', $status, $reference_id, $userId);
        if ($updateTransaction->execute()) {
            // update deposit history
            $updateTransaction->close();

            $updateDeposit = $connection->prepare("UPDATE deposit SET status = ? WHERE reference_id = ? AND userId = ?");
            $updateDeposit->bind_param('ssi', $status, $reference_id, $userId);
            if ($updateDeposit->execute()) {
                $updateDeposit->close();

                // fetch amount to deposit
                $query = $connection->prepare("SELECT amount, txn_id FROM transactions WHERE reference_id = ? AND userId = ?");
                $query->bind_param('si', $reference_id, $userId);
                $query->execute();
                $amountResult = $query->get_result()->fetch_assoc();
                $amount = $amountResult['amount'] ?? null;
                $txn_id = $amountResult['txn_id'] ?? null;
                $query->close();

                if ($amount === null) {
                    ob_end_clean();
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Transaction not found or Invalid amount detected']);
                    exit;
                }

                // update users balance
                $users = $connection->prepare("UPDATE users SET balance = balance + ?, total_deposit = total_deposit + ? WHERE id = ?");
                $users->bind_param('ddi', $amount, $amount, $userId);
                if ($users->execute()) {
                    // fetch users data
                    $fetchUser = $connection->prepare("SELECT email, username FROM users WHERE id = ?");
                    $fetchUser->bind_param('i', $userId);
                    $fetchUser->execute();
                    $result = $fetchUser->get_result()->fetch_assoc();
                    $username = $result['username'];
                    $email = $result['email'];

                    // mail infomation
                    $mail->addAddress($email);
                    $emailSubject = 'Deposit Successful! Your Funds Have Been Credited'; // New Subject
                    $mail->Subject = $emailSubject; // Don't forget to set the subject for PHPMailer
                    $websiteName = 'Pulse Profit';
                    $dashboardLink = "https://thepulseprofit.org/user/dashboard";
                    $depositAmount = $amount; 
                    $txnId = '#TXN' . $txn_id;
                    $logoUrl = "https://thepulseprofit.org/pulseprofit/component/logo.png";

                    // email body
                    $emailBody = 
                    <<<EOT
                    <!DOCTYPE html>
                    <html lang="en">
                    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                        <tr>
                                            <td align="center" style="padding: 20px 0; background-color: #28a745; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                                <img src="$logoUrl" alt="$websiteName Logo" style="display: block; width: 150px; height: auto;">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 40px 30px 40px 30px; color: #333333;">
                                                <h1 style="color: #28a745; font-size: 24px; margin: 0 0 20px 0;">Deposit Successful!</h1>
                                                <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
                                                    Hi, <strong>$username</strong>,
                                                    <br><br>
                                                    Great news! Your deposit of $ $depositAmount has been successfully processed and credited to your account. You can now start using your funds.
                                                </p>

                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px; border: 1px solid #eeeeee; border-radius: 6px;">
                                                    <tr>
                                                        <td colspan="2" style="padding: 15px; background-color: #f8f9fa; font-weight: bold; font-size: 16px; color: #333333;">
                                                            Transaction Details
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 10px 15px; border-top: 1px solid #eeeeee; width: 40%; font-weight: bold;">
                                                            Amount Credited:
                                                        </td>
                                                        <td style="padding: 10px 15px; border-top: 1px solid #eeeeee; color: #333333;">
                                                            <strong>$ $depositAmount</strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 10px 15px; border-top: 1px solid #eeeeee; width: 40%; font-weight: bold;">
                                                            Transaction ID:
                                                        </td>
                                                        <td style="padding: 10px 15px; border-top: 1px solid #eeeeee;">
                                                            $txnId
                                                        </td>
                                                    </tr>
                                                </table>
                                                
                                                <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                                                    Your balance has been updated. Log in to your dashboard to view your new balance and manage your account.
                                                </p>

                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td align="center" style="padding: 10px 0 30px 0;">
                                                            <table border="0" cellpadding="0" cellspacing="0">
                                                                <tr>
                                                                    <td align="center" bgcolor="#28a745" style="border-radius: 6px;">
                                                                        <a href="$dashboardLink" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 12px 25px; border: 1px solid #28a745; display: inline-block; border-radius: 6px; font-weight: bold;">
                                                                            Go to Dashboard
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <p style="margin: 0; font-size: 14px; color: #777777;">
                                                    Thank you for choosing $websiteName.<br>The $websiteName Team
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 20px 30px; font-size: 12px; color: #999999; background-color: #eeeeee; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;" align="center">
                                                <p style="margin: 0;">&copy; 2025 $websiteName. All rights reserved.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                    EOT;

                    $mail->Body = $emailBody;
                    if ($mail->send()) {
                        // send email to user
                        $connection->commit();
                        http_response_code(201);
                        echo json_encode(['status' => 'success', 'message' => 'Deposit has been accepted successfully']);
                    }

                    else {
                        $connection->rollback();
                        http_response_code(400);
                        echo json_encode(['status' => 'error', 'message' => 'An error occured while sending email']);
                    }
                }

                else {
                    $connection->rollback();
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'An error occured while updating users balance']);
                }
            }

            else {
                $connection->rollback();
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Something went wrong']);
                exit;
            }
        }

        else {
            $connection->rollback();
            ob_end_clean();
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Something went wrong']);
            exit;
        }
    }

    catch (Exception $e) {
        ob_end_clean();
        $connection->rollback();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }