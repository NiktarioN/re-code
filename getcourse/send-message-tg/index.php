<?
/**
 * Plugin Name: Отправляем уведомления в Telegram
 * Version: 1.0
 * Author: RE-CODE STUDIO
 * Author URL: https://techeducation.ru/y/8bbf221
 */

$requiredParams = [
  "bot_token" => "Не указан токен бота telegram",
  "chat_id" => "Не указан ID чата для отправки сообщения",
  "text" => "Не указан шаблон текста для сообщения",
];

$errors = [];
foreach ($requiredParams as $param => $paramError) {
  if (!isset($_GET[$param]) || empty($_GET[$param])) {
    $errors[] = $paramError;
  }
}
if (!empty($errors)) {
  exit(print_r($errors));
}

$textArray = [
  "shablon-1" => "Сообщение по заказу было успешно отправлено",
];

$responseUrl = "https://api.telegram.org/bot" . $_GET["bot_token"] . "/sendMessage?chat_id=" . $_GET["chat_id"] . "&text=" . $textArray[$_GET["text"]];
$response = file_get_contents($responseUrl);
print_r($response);