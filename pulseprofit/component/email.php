<?php
    // Enable error reporting (for development only)
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // PHPMailer setup
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    require __DIR__ . "/../phpmailer/src/Exception.php";
    require __DIR__ . "/../phpmailer/src/PHPMailer.php";
    require __DIR__ . "/../phpmailer/src/SMTP.php";

    // Create PHPMailer instance
    $mail = new PHPMailer(true);

    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPDebug = 0; // Max detail
    $mail->Debugoutput = 'error_log';
    $mail->SMTPAuth = true;
    $mail->Username = 'pluseprofit2@gmail.com';
    $mail->Password = 'ksgt fwzm jmxo bdtl';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL encryption
    $mail->Port = 465;
    // $mail->SMTPSecure = 'tls';


    // Recipients
    $mail->setFrom('pluseprofit2@gmail.com', 'Pulse Profit');
    // Content
    $mail->isHTML(true);
    $logoUrl = "https://thepulseprofit.org/pulseprofit/component/logo.png";