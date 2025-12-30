<?php   
    require "../../config/database.php";

    $address = "rMaQBTmtAAbPeLpfDR28gYABENh91gbLKu";
    $wallet_name = "XRP";
    $status = 'ACTIVE';
    $stmt = $connection->prepare("INSERT INTO wallet (wallet_name, wallet_address, status) VALUES (?, ?, ?)");
    $stmt->bind_param('sss', $wallet_name, $address, $status);
    if ($stmt->execute()) {
        echo "Done";
        die;
    }