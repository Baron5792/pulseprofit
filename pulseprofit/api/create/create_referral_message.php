<?php
    ini_set('display_errors', 0); 
    ini_set('display_startup_errors', 0);
    error_reporting(E_ALL);
    ob_start();
    require '../../component/required.php';
    require "../../config/database.php";
    include "../../component/email.php";

    if (!isset($_SESSION['user']['id'])) {
        ob_end_clean();
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired.']);
        exit;
    }

    $connection->begin_transaction();
    try {
        $userId = $_SESSION['user']['id'];
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $recipient_email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
        
        // fetch users firstname
        $fetch = $connection->prepare("SELECT fullname, referral_id FROM users WHERE id = ?");
        $fetch->bind_param('i', $userId);
        if ($fetch->execute()) {
            $result = $fetch->get_result()->fetch_assoc();
            $fullname = $result['fullname'];
            $referralCode = $result['referral_id'];
            // send email
            $mail->addAddress($recipient_email);
            $websiteName = "Pulse Profit";
            $referralLink = "https://thepulseprofit.org/account/register?referralid=" . $referralCode;

            $emailBody = <<<EOT
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
                            <h1 style="color: #007bff; font-size: 24px; margin: 0 0 20px 0;">You've Been Invited to Join $websiteName!</h1>
                            <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
                                Your friend, <strong>$fullname</strong>, thinks you'd be a great fit for our platform and has sent you an exclusive referral invitation.
                            </p>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 10px 0 30px 0;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" bgcolor="#28a745" style="border-radius: 6px;">
                                                    <a href="$referralLink" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 12px 25px; border: 1px solid #28a745; display: inline-block; border-radius: 6px; font-weight: bold;">
                                                        Join $websiteName Now!
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6;">
                                We look forward to welcoming you!
                            </p>
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
                $mail->Subject = "You've been invited by " . $fullname . " to join $websiteName!";
                $mail->Body = $emailBody;

                if ($mail->send()) {
                    ob_end_clean();
                    $connection->commit();
                    http_response_code(200);
                    echo json_encode(['status' => 'success', 'message' => 'Success']);
                }

                else {
                    ob_end_clean();
                    $connection->rollback();
                    error_log("PHPMailer Referral Error: " . $mail->ErrorInfo);
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'An error occured. Please try again later.']);
                }
        }

        else {
            ob_end_clean();
            $connection->rollback();
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'An error occured. Please try again later.']);
        }
    }

    catch (Exception $e) {
        $connection->rollback();
        ob_end_clean();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }