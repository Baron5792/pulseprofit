<?php
    ob_start();
    require "../../component/required.php";
    require "../../config/database.php";
    include "../../component/email.php";

    if (!isset($_SESSION['user']['id'])) {
        ob_end_clean();
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    } 

    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $current_password = $data['current_password'] ?? null;
        $new_password = $data['new_password'] ?? null;
        $confirm_new_password = $data['confirm_new_password'] ?? null;
        $userId = $_SESSION['user']['id'];

        if ($current_password === null || $new_password === null || $confirm_new_password === null) {
            ob_end_clean();
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        if ($new_password !== $confirm_new_password) {
            ob_end_clean();
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Confirm password does not match.']);
            exit;
        }

        if (strlen($new_password) < 6) {
            ob_end_clean();
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'The password must contain a minimum of 6 characters.']);
            exit;
        }

        // fetch database password
        $fetch = $connection->prepare("SELECT password, email, username FROM users WHERE id = ?");
        $fetch->bind_param('i', $userId);
        $fetch->execute();
        $result = $fetch->get_result()->fetch_assoc();
        $databasePassword = $result['password'];
        $email = $result['email'];
        $username = $result['username'];

        if (password_verify($current_password, $databasePassword)) {
            // update the new passowrd
            // hash the new password
            $hash = password_hash($new_password, PASSWORD_DEFAULT);
            $update = $connection->prepare("UPDATE users SET password = ? WHERE id = ?");
            $update->bind_param('si', $hash, $userId);
            if ($update->execute()) {
                // send email
                $mail->addAddress($email);
                $depositLink = "https://thepulseprofit.org/user/deposit/";
                $mail->Subject = 'Password changed successfully';
                $websiteName = 'Pulse Profit';
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
                                                <h1 style="color: #007bff; font-size: 24px; margin: 0 0 20px 0;">Your Password Has Been Successfully Updated</h1>
                                                <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
                                                    Hi, <strong>$username</strong>, This email confirms that the password for your account on $websiteName has been successfully changed.
                                                </p>
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td align="center" style="padding: 10px 0 30px 0;">
                                                            <table border="0" cellpadding="0" cellspacing="0">
                                                                <tr>
                                                                    <td align="center" bgcolor="#28a745" style="border-radius: 6px;">
                                                                        <a href="$depositLink" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 12px 25px; border: 1px solid #28a745; display: inline-block; border-radius: 6px; font-weight: bold;">
                                                                            Click to continue your investment
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <p style="margin: 0; font-size: 14px; color: #777777;">
                                                    Best regards,<br>The $websiteName Team
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
                    ob_end_clean();
                    http_response_code(201);
                    echo json_encode(['status' => 'success', 'message' => 'Password has been changed successfully']);
                }

                else {
                    ob_end_clean();
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => 'An error occured. Please try again later']);
                }
            }

            else {
                ob_end_clean();
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'An error occured during the process']);
            }
        }   

        else {
            ob_end_clean();
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Current password is wrong']);
        }
    }

    catch (Exception $e) {
        ob_end_clean();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }