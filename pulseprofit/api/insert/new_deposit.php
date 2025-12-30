    <?php
        require "../../component/required.php";
        require "../../config/database.php";
        include "../../component/email.php";
        ob_start();

        // check for cookies
        const UPLOAD_DIR = '../../images/deposit_screenshot/';
        $session_token = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token']: null;
        $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN']: null;

        if (!$session_token || !$received_token || $received_token !== $session_token) {
            ob_end_clean();
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Something went wrong. Please refresh the page and try again']);
            exit;
        }

        if (!isset($_SESSION['user']['id'])) {
            ob_end_clean();
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Something went wrong! Please refresh the page and try again']);
            exit;
        }

        try {
            if (!isset($_FILES['screenshot_file']) || !isset($_POST['reference_id']) || !isset($_POST['tnx_id']) || !isset($_POST['amount']) || !isset($_POST['wallet_name']) || !isset($_POST['wallet_address']) || !isset($_POST['wallet'])) {
                die(json_encode(['status' => 'error', 'message' => 'Missing deposit identifiers']));
            }

            $image = $_FILES['screenshot_file'];
            $reference_id = filter_var($_POST['reference_id'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $txn_id = filter_var($_POST['tnx_id'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $amount = filter_var($_POST['amount'], FILTER_VALIDATE_FLOAT);
            $userId = $_SESSION['user']['id'];
            $wallet_name = filter_var($_POST['wallet_name'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $wallet_address = filter_var($_POST['wallet_address'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $wallet = filter_var($_POST['wallet'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);

            if (empty($image['name'])) {
                ob_end_clean();
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'No image was found']);
                exit;
            }

            if ($amount == false || $amount <= 0) {
                ob_end_clean();
                http_response_code(400);
                die(json_encode(['status' => 'error', 'message' => 'Invalid deposit amount']));
            }

            if (empty($reference_id) || empty($txn_id) || empty($amount)) {
                ob_end_clean();
                http_response_code(400);
                die(json_encode(['status' => 'error', 'message' => 'Something went wrong! Please try again']));
            }

            // fetch users username using using UserId
            $query = $connection->prepare("SELECT fullname, username, email FROM users WHERE id = ?");
            $query->bind_param('i', $userId);
            $query->execute();
            $result = $query->get_result()->fetch_assoc();
            $fullname = $result['fullname'];
            $username = $result['username'];
            $email = $result['email'];

            // first update the deposit_track and mark it completed
            $update = $connection->prepare("UPDATE deposit_track SET status = 'COMPLETED' WHERE reference_id= ? AND txn_id= ? AND userId= ?");
            $update->bind_param('ssi', $reference_id, $txn_id, $userId);
            if ($update->execute()) {
                ob_end_clean();
                // check if reference and txn_id exist already
                $confirm = $connection->prepare('SELECT reference_id, txn_id, userId FROM deposit WHERE reference_id= ? AND txn_id = ? AND userId = ?');
                $confirm->bind_param('ssi', $reference_id, $txn_id, $userId);
                $confirm->execute();
                $fetchConfirm = $confirm->get_result();
                if ($fetchConfirm->num_rows > 0) {
                    ob_end_clean();
                    // deposit with reference, txn_id and userId exist already
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'This transaction has already been submitted for verification.']);
                    exit;
                }

                // validate image
                $time = time();
                $imageName = $time . $image['name'];
                $tmp_name = $image['tmp_name'];
                $destination = UPLOAD_DIR . $imageName;
                $allowed_files = ['png', 'jpg', 'jpeg'];
                $extension = explode('.', $imageName);
                $extension = end($extension);

                if (!in_array($extension, $allowed_files)) {
                    ob_end_clean();
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'File must be an image']);
                    exit;
                }

                // upload the image
                if (move_uploaded_file($tmp_name, $destination)) {
                    // insert into deposit table 
                    $deposit_status = 'PENDING';
                    $deposit_title = 'Deposit';
                    $insert = $connection->prepare('INSERT INTO deposit (userId, txn_id, amount, reference_id, wallet_name, wallet_address, screenshot, status, wallet) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
                    $insert->bind_param('isdssssss', $userId, $txn_id, $amount, $reference_id, $wallet_name, $wallet_address, $imageName, $deposit_status, $wallet);
                    if ($insert->execute()) {
                        // update transaction history
                        $stmt = $connection->prepare("INSERT INTO transactions (userId, title, reference_id, txn_id, amount, status, wallet_name) VALUES (?, ?, ?, ?, ?, ?, ?)");
                        $stmt->bind_param('isssdss', $userId, $deposit_title, $reference_id, $txn_id, $amount, $deposit_status, $wallet_name);
                        if ($stmt->execute()) {

                            // send email to user
                            $mail->addAddress($email);
                            $websiteName = 'Pulse Profit';
                            $dashboardLink = "https://thepulseprofit.org/user/dashboard";
                            $depositAmount = $amount; // Placeholder: Replace with actual $deposit_amount
                            $txnId = '#TXN' . $txn_id;
                            $logoUrl = "https://thepulseprofit.org/pulseprofit/component/logo.png";
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
                                                    <td align="center" style="padding: 20px 0; background-color: #007bff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                                        <img src="$logoUrl" alt="$websiteName Logo" style="display: block; width: 150px; height: auto;">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 40px 30px 40px 30px; color: #333333;">
                                                        <h1 style="color: #ffc107; font-size: 24px; margin: 0 0 20px 0;">Deposit Awaiting Approval</h1>
                                                        <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
                                                            Hi, <strong>$username</strong>,
                                                            <br><br>
                                                            We have successfully recorded your deposit request. Your transaction is currently **pending** and being reviewed by our team for final confirmation.
                                                        </p>

                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px; border: 1px solid #eeeeee; border-radius: 6px;">
                                                            <tr>
                                                                <td colspan="2" style="padding: 15px; background-color: #f8f9fa; font-weight: bold; font-size: 16px; color: #333333;">
                                                                    Transaction Details
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 10px 15px; border-top: 1px solid #eeeeee; width: 40%; font-weight: bold;">
                                                                    Amount Deposited:
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
                                                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #dc3545;">
                                                            **What happens next?** Our finance team is verifying the transaction. This process may take **1-2 hours** depending on network traffic. Once confirmed, your funds will be credited, and you will receive a separate confirmation email.
                                                        </p>

                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                            <tr>
                                                                <td align="center" style="padding: 10px 0 30px 0;">
                                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                                        <tr>
                                                                            <td align="center" bgcolor="#007bff" style="border-radius: 6px;">
                                                                                <a href="$dashboardLink" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 12px 25px; border: 1px solid #007bff; display: inline-block; border-radius: 6px; font-weight: bold;">
                                                                                    View Account Dashboard
                                                                                </a>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <p style="margin: 0; font-size: 14px; color: #777777;">
                                                            Thank you for your patience as we finalize your deposit.<br>The $websiteName Team
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
                            $mail->Subject = "Deposit Received! Awaiting Confirmation from Pulse Profit";
                            $mail->Body = $emailBody;
                            if ($mail->send()) {
                                $mail->clearAllRecipients();
                                // send to admin
                                $mail->Subject = 'New deposit on Pulse Profit';
                                $depositTime = date('Y-m-d H:i:s');
                                $mail->addAddress('plusprofitfunds@gmail.com');
                                // $mail->addAddress('egbocollins001@gmail.com');
                                $mail->Body = <<<EOT
                                <!DOCTYPE html>
                                <html>
                                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                                    <h2 style="color: #28a745;">New Deposit Alert!</h2>
                                    <p><strong>Hi Eric !, </strong></p>
                                    <p>a new deposit was just made on your pulse profit platform below are the details</p>
                                    <table border="0" cellpadding="5" cellspacing="0" style="border: 1px solid #ccc; border-collapse: collapse; width: 400px;">
                                        <tr><td style="background-color: #f4f4f4; font-weight: bold;">Name:</td><td>{$fullname}</td></tr>
                                        <tr><td style="background-color: #f4f4f4; font-weight: bold;">Email:</td><td>{$email}</td></tr>
                                        <tr><td style="background-color: #f4f4f4; font-weight: bold;">Amount:</td><td>$ {$amount}</td></tr>
                                        <tr><td style="background-color: #f4f4f4; font-weight: bold;">Registration Date:</td><td>{$depositTime}</td></tr>
                                    </table>
                                    
                                    <p>You can verify their details in the admin panel.</p>
                                    <p>Best regards,<br>The Pulse Profit System</p>
                                </body>
                                </html>
                                EOT;
                                if ($mail->send()) {
                                    http_response_code(201);
                                    echo json_encode(['status' => 'success', 'message' => 'Deposit has been made sucessfully']);
                                }

                                else {
                                    http_response_code(500);
                                    echo json_encode(['status' => 'error', 'message' => 'An error occured while processing your deposit']);
                                    exit;
                                }
                            }

                            else {
                                http_response_code(400);
                                echo json_encode(['status' => 'error', 'message' => '']);
                            }
                        }

                        else {
                            http_response_code(500);
                            echo json_encode(['status' => 'error', 'message' => 'Deposit recorded, but logging history failed. Please contact support.']);
                        }
                    }

                    else {
                        http_response_code(404);
                        echo json_encode(['status' => 'error', 'message' => 'An error occured. Please try again later']);                
                    }
                }
            }

            else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Deposit identifier not found']);
                exit;
            }
        }

        catch(Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
        }