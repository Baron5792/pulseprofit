<?php
    require "../../config/database.php";

    $title = 'Basic';
    $uniqId = uniqid('plan_', true);
    $daily_interest = 4;
    $term = 2;
    $min = 1000;
    $max = 4999;
    $return = 56;

    $stmt = $connection->prepare("INSERT INTO plans (uniqId, title, daily_interest, term, min, max, total_return) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('ssiiiii', $uniqId, $title, $daily_interest, $term, $min, $max, $return);
    if ($stmt->execute()) {
        echo "success";
    }