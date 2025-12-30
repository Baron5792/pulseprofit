<?php
    require '../../component/required.php';
    require '../../config/database.php';
    include "../../component/email.php";

    //  check for csrf token
    $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN'] : null;
    $session_token = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token'] : null;

    if (!$received_token || !$session_token || $received_token !== $session_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please refresh the page and try again']);
        exit;
    }

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!isset($data) || $data === null) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
        exit;
    }

    $connection->begin_transaction();
    try {
        $fullname = trim($data['fullName'] ?? null);
        $username = trim($data['username'] ?? null);
        $email = trim($data['email'] ?? null);
        $password = $data['password'] ?? '';
        $refId = $data['referralId'] ?? '';

        if (empty($fullname) || empty($email) || empty($password) || empty($username)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
            exit;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400); // 400 Bad Request is better for input validation errors
            echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
            exit;
        }

        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Password length must exceed 6 characters']);
            exit;
        }

        // check if email exists already
        $checkQuery = $connection->prepare("SELECT email, username FROM users WHERE email= ? OR username= ?");
        $checkQuery->bind_param('ss', $email, $username);
        $checkQuery->execute();
        $checkResult = $checkQuery->get_result();
        if ($checkResult->num_rows > 0) {
            $existing_user = $checkResult->fetch_assoc();
            http_response_code(409);
            if ($existing_user['email'] == $email) {
                echo json_encode(['status' => 'error', 'message' => 'Email already registered']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Username already taken']);
            }
            exit;
        }       

        $referrer = '';
        if (strlen($refId) > 0) {
            // validate referral ID
            $queryId = $connection->prepare('SELECT * FROM users WHERE referral_id= ?');
            $queryId->bind_param('s', $refId);
            $queryId->execute();
            $referralResult = $queryId->get_result();
            if ($referralResult->num_rows < 1) {
                http_response_code(403);
                echo json_encode(['status' => 'error', 'message' => 'Invalid referral code, please check and try again']);
                exit;
            }
            $referrer = $refId;
        }

        else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
            exit;
        }

        //  hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // create a regId and a referral code
        $referralCode = bin2hex(random_bytes(16));
        function generateSecureRegId() {
            $regId = '';
            
            // Generate 13 random digits using cryptographically secure random function
            for ($i = 0; $i < 13; $i++) {
                $regId .= random_int(0, 9);
            }
            
            return $regId;
        }

        $regId = generateSecureRegId();
        $fixed_balance = "200.00";

        // insert new user
        $stmt = $connection->prepare("INSERT INTO users (reg_id, referral_id, fullname, username, email, password, balance, referer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param('ssssssss', $regId, $referralCode, $fullname, $username, $email, $hashed_password, $fixed_balance, $referrer);
        if ($stmt->execute()) {
            // send email
            $websiteName = "Pulse Profit"; 
            $dashboardUrl = "https://thepulseprofit.org/user/dashboard"; // URL to their dashboard
            $supportEmail = "support@thepulseprofit.org";
            $mail->Subject = "Welcome to $websiteName! Your Account is Ready.";
            $mail->addAddress($email);
            $logoUrl = "https://thepulseprofit.org/pulseprofit/component/logo.png";

            // email body
            $welcomeEmailBody = <<<EOT
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to $websiteName!</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="center" style="padding: 20px 0;">
                                <table border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                    
                                    <tr>
                                        <td align="center" style="padding: 20px 0; background-color: #17a2b8; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                            <img src="$logoUrl" alt="$websiteName Logo" style="display: block; width: 150px; height: auto;">
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 40px 30px 40px 30px; color: #333333;">
                                            <h1 style="color: #17a2b8; font-size: 28px; margin: 0 0 20px 0;">Welcome, $username!</h1>
                                            
                                            <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
                                                Thank you for registering with **$websiteName**. We're excited to have you join our community!
                                            </p>
                                            
                                            <h2 style="color: #333333; font-size: 20px; margin: 0 0 15px 0;">What to do next:</h2>

                                            <ol style="margin: 0 0 30px 20px; padding: 0; font-size: 16px; line-height: 1.6;">
                                                <li>Explore Your Dashboard: See your stats, manage your account, and track your progress.</li>
                                                <li>Complete Your Profile: Head to your settings to fill out any missing details.</li>
                                                <li>Make Your First Deposit: Ready to start? Click below to fund your account and begin!</li>
                                            </ol>
                                            
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td align="center" style="padding: 10px 0 30px 0;">
                                                        <table border="0" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td align="center" bgcolor="#28a745" style="border-radius: 6px;">
                                                                    <a href="$dashboardUrl" target="_blank" style="font-size: 18px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 15px 30px; border: 1px solid #28a745; display: inline-block; border-radius: 6px; font-weight: bold;">
                                                                        Go to Your Dashboard
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>

                                            <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                                                If you have any questions, please don't hesitate to reach out to us at <a href="mailto:$supportEmail" style="color: #17a2b8;">$supportEmail</a>.
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 20px 30px; font-size: 12px; color: #999999; background-color: #eeeeee; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;" align="center">
                                            <p style="margin: 0;">This email confirms your registration on **$websiteName**.</p>
                                            <p style="margin: 5px 0 0 0;">&copy; 2025 $websiteName. All rights reserved.</p>
                                        </td>
                                    </tr>
                                    
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            EOT;
            $mail->Body = $welcomeEmailBody;
            if ($mail->send()) {
                $mail->clearAllRecipients();
                // admins email
                $registrationTime = date('Y-m-d H:i:s');
                $adminEmail = 'plusprofitfunds@gmail.com';
                $mail->Subject = 'New Registration';
                $mail->Body = <<<EOT
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #28a745;">Congrats, New User Registered!</h2>
                    <p>Hello Eric,</p>
                    <p>A new user just registered on your Pulse Profit platform. Below are the user details:</p>
                    
                    <table border="0" cellpadding="5" cellspacing="0" style="border: 1px solid #ccc; border-collapse: collapse; width: 400px;">
                        <tr><td style="background-color: #f4f4f4; font-weight: bold;">Name:</td><td>{$fullname}</td></tr>
                        <tr><td style="background-color: #f4f4f4; font-weight: bold;">Email:</td><td>{$email}</td></tr>
                        <tr><td style="background-color: #f4f4f4; font-weight: bold;">Registration Date:</td><td>{$registrationTime}</td></tr>
                    </table>
                    
                    <p>You can verify their details in the admin panel.</p>
                    <p>Best regards,<br>The Pulse Profit System</p>
                </body>
                </html>
                EOT;
                $mail->addAddress($adminEmail);
                if ($mail->send()) {
                    $connection->commit();
                    http_response_code(201);
                    echo json_encode(['status' => 'success', 'message' => 'Registration successful']);
                }

                else {
                    $connection->rollback();
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => 'An error occured']);
                }
            }

            else {
                $connection->rollback();
                error_log("PHPMailer Error during registration: " . $mail->ErrorInfo);
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Registration successful, but we could not send the welcome email.']);
            }
        }

        else {
            $connection->rollback();
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Registration failed, please try again']);
            exit;
        }
        
    }

    catch (Exception $e) {
        $connection->rollback();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }