<?php
/** @var \App\Model\Flower $flower */
/** @var \App\Service\Router $router */

$title = "{$flower->getName()} ({$flower->getId()})";
$bodyClass = 'flower-show';

ob_start(); ?>
    <h1><?= htmlspecialchars($flower->getName()) ?></h1>
    <h2>Color: <?= htmlspecialchars($flower->getColor()) ?></h2>

    <article>
        <?= nl2br(htmlspecialchars($flower->getDescription())); ?>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('flower-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('flower-edit', ['id' => $flower->getId()]) ?>">Edit</a></li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
