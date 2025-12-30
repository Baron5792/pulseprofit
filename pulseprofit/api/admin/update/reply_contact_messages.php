<?php
    ob_start();
    require "../../../component/required.php";
    require "../../../config/database.php";
    include "../../../component/email.php";

    if (!isset($_SESSION['user']['id'])) {
        ob_end_clean();
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    try {
        // accept data
        $file_content = file_get_contents('php://input');
        $decode_file = json_decode($file_content, true);

        $messageId = $decode_file['messageId'] ?? null;
        $subject = $decode_file['subject'] ?? null;
        $message = $decode_file['message'] ?? null;
        $sanitizedMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

        if (!$messageId || !$subject || !$message) {
            ob_end_clean();
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        // fetch email from the message Id for a reply
        $fetch = $connection->prepare("SELECT email, fullname FROM contact_us WHERE id = ?");
        $fetch->bind_param('i', $messageId);
        if ($fetch->execute()) {
            ob_end_clean();
            // fetch data
            $result = $fetch->get_result()->fetch_assoc();
            $fullname = $result['fullname'];
            $email = $result['email'];

            // send email
            $mail->addAddress($email);
            $mail->Subject = $subject;
            $websiteName = "Pulse Profit";
            $logoUrl = 'https://thepulseprofit.org/pulseprofit/component/logo.png';
            $dashboardLink = 'https://thepulseprofit.org/user/dashboard';
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
                                            <h1 style="color: #28a745; font-size: 24px; margin: 0 0 20px 0;">$subject!</h1>
                                            <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
                                                Hi, <strong>$fullname</strong>,
                                                <br><br>
                                                $sanitizedMessage
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
                // update completed status
                $completed_status = 'COMPLETED';
                $update = $connection->prepare("UPDATE contact_us SET status = ? WHERE id = ?");
                $update->bind_param('si', $completed_status, $messageId);
                if ($update->execute()) {
                    http_response_code(201);
                    echo json_encode(['status' => 'success', 'message' => 'Reply has been sent successfully']);
                }

                else {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'An error occured while updating server']);
                }
            }

            else {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'An error occured while sending email']);
            }
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'No data was found']);
        }
    }

    catch (Exception $e) {
        ob_end_clean();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }