<?php
    ob_start();
    require "../../component/required.php";
    require "../../config/database.php";
    require "../../component/email.php";

    $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN']: null;
    $session_token = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token'] : null;

    if (!$received_token || !$session_token || $received_token !== $session_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please refresh the page and try again']);
        exit;
    }

    $connection->begin_transaction();
    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $emailOrUsername = $data['emailOrUsername'] ?? null;

        if ($emailOrUsername === null || empty($emailOrUsername)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'An email or username is required to proceed']);
            exit;
        }

        // verify if email exist
        $query = $connection->prepare("SELECT id, email, fullname from users WHERE email = ? OR username = ?");
        $query->bind_param('ss', $emailOrUsername, $emailOrUsername);
        $query->execute();
        $result = $query->get_result();
        if ($result->num_rows < 1) {
            ob_end_clean();
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'This email or username does not exist']);
            exit;
        }

        $usersData = $result->fetch_assoc();
        $email = $usersData['email'] ?? null;
        $username = $usersData['fullname'] ?? null;

        // if the email exist
        // send an otp for verification and create a reference ID
        $reference_id = uniqid();
        $status = 'PENDING';
        $otp = random_int(1000, 9999);

        // insert into database
        $insert = $connection->prepare("INSERT INTO reset_password (email, reference_id, verification_code, status) VALUES (?, ?, ?, ?)");
        $insert->bind_param('ssis', $emailOrUsername, $reference_id, $otp, $status);
        if ($insert->execute()) {
            // validate email sending
            $mail->addAddress($email);
            $emailSubject = 'Password Reset Request - Your Verification Code';
            $mail->Subject = $emailSubject;
            $websiteName = 'Pulse Profit';
            $verifyLink = "https://thepulseprofit.org/account/password/reset-password?reference=" . $reference_id;
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
                                        <h1 style="color: #007bff; font-size: 24px; margin: 0 0 20px 0;">Password Change Verification</h1>
                                        <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
                                            Hi, <strong>$username</strong>,
                                            <br><br>
                                            You recently requested to change your password. Please use the verification code below to complete the process.
                                        </p>

                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px; border: 1px solid #eeeeee; border-radius: 6px;">
                                            <tr>
                                                <td colspan="2" style="padding: 15px; background-color: #f8f9fa; font-weight: bold; font-size: 16px; color: #333333; text-align: center;">
                                                    Your One-Time Password (OTP)
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="padding: 25px 15px; border-top: 1px solid #eeeeee;">
                                                    <div style="font-size: 32px; font-weight: bold; color: #333333; letter-spacing: 10px; padding: 10px 20px; border: 3px solid #007bff; display: inline-block; border-radius: 8px; background-color: #f0f8ff;">
                                                        $otp
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="padding: 10px 15px 15px 15px; font-size: 14px; color: #777777;">
                                                    This code is valid for a limited time and should not be shared.
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                                            If you did not request this password change, you can safely ignore this email. Your password will remain the same.
                                        </p>

                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="center" style="padding: 10px 0 30px 0;">
                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td align="center" bgcolor="#007bff" style="border-radius: 6px;">
                                                                <a href="$verifyLink" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 12px 25px; border: 1px solid #007bff; display: inline-block; border-radius: 6px; font-weight: bold;">
                                                                    Go to Verification Page
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>

                                        <p style="margin: 0; font-size: 14px; color: #777777;">
                                            If you have any issues, please contact our support team.<br>The $websiteName Team
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
                $connection->commit();
                http_response_code(201);
                echo json_encode(['status' => 'success', 'message' => 'OTP Verification code has been sent successfully', 'data' => $reference_id]);
            }

            else {
                $connection->rollback();
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'An error occured during the process. Please try again later']);
            }
        }

        else {
            $connection->rollback();
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'An error occured while processing your request']);
        }
    }

    catch (Exception $e) {
        ob_end_clean();
        $connection->rollback();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }